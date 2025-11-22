import crypto from 'crypto';
import { storage } from './storage';
import type { InsertShopifyTransaction } from '@shared/schema';

// Product mapping: SKU -> Product configuration
interface ProductConfig {
  type: 'prepaid_credits' | 'subscription';
  questions?: number; // For prepaid credits
  plan?: 'basic' | 'individual' | 'premium'; // For subscriptions
  expectedPrice: number; // Price in cents (EUR)
  durationDays?: number; // For subscriptions
}

// Centralized SKU mapping
const SKU_MAPPING: Record<string, ProductConfig> = {
  // Prepaid Credit Packs
  'NUXA-PACK-BASIC-15': {
    type: 'prepaid_credits',
    questions: 15,
    expectedPrice: 500, // €5.00
  },
  'NUXA-PACK-PREMIUM-35': {
    type: 'prepaid_credits',
    questions: 35,
    expectedPrice: 1000, // €10.00
  },
  
  // Personal Subscription Plans
  'NUXA-SUB-BASIC-MONTH': {
    type: 'subscription',
    plan: 'basic',
    expectedPrice: 299, // €2.99
    durationDays: 30,
  },
  'NUXA-SUB-INDIV-MONTH': {
    type: 'subscription',
    plan: 'individual',
    expectedPrice: 599, // €5.99
    durationDays: 30,
  },
  'NUXA-SUB-PREMIUM-YEAR': {
    type: 'subscription',
    plan: 'premium',
    expectedPrice: 3200, // €32.00
    durationDays: 365,
  },
  
  // Business Plans (for reference, custom pricing)
  'NUXA-BUS-PROF-MONTH': {
    type: 'subscription',
    plan: 'basic', // Map to basic for now
    expectedPrice: 14950, // €149.50
    durationDays: 30,
  },
  'NUXA-BUS-CORP-MONTH': {
    type: 'subscription',
    plan: 'individual', // Map to individual for now
    expectedPrice: 59800, // €598.00
    durationDays: 30,
  },
};

/**
 * Verify Shopify webhook HMAC signature
 */
export function verifyShopifyWebhook(body: Buffer, hmacHeader: string, secret: string): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');
  
  return hash === hmacHeader;
}

/**
 * Process Shopify order and activate user account
 */
export async function processShopifyOrder(orderData: any): Promise<{
  success: boolean;
  message: string;
  transactionId?: number;
}> {
  try {
    console.log('=== PROCESSING SHOPIFY ORDER ===');
    console.log('Order ID:', orderData.id);
    console.log('Order Number:', orderData.order_number);
    console.log('Customer Email:', orderData.email);
    console.log('Financial Status:', orderData.financial_status);
    
    // Only process paid orders
    if (orderData.financial_status !== 'paid') {
      console.log('⏭️ Skipping non-paid order');
      return {
        success: true,
        message: 'Order not yet paid, skipped'
      };
    }
    
    // Check if order already processed (idempotency)
    const existingTransaction = await storage.getShopifyTransactionByOrderId(orderData.id.toString());
    if (existingTransaction) {
      console.log('⏭️ Order already processed, skipping');
      return {
        success: true,
        message: 'Order already processed',
        transactionId: existingTransaction.id
      };
    }
    
    // Extract customer email
    const customerEmail = orderData.email || orderData.customer?.email;
    if (!customerEmail) {
      console.error('❌ No customer email found');
      return {
        success: false,
        message: 'No customer email found'
      };
    }
    
    // Find user by email
    const users = await storage.getAllUsers();
    const user = users.find(u => u.email === customerEmail);
    
    if (!user) {
      console.error('❌ User not found for email:', customerEmail);
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    console.log('✅ User found:', user.username, 'ID:', user.id);
    
    // Process each line item
    for (const item of orderData.line_items) {
      const sku = item.sku;
      const productConfig = SKU_MAPPING[sku];
      
      if (!productConfig) {
        console.warn(`⚠️ Unknown SKU: ${sku}, skipping item`);
        continue;
      }
      
      console.log(`Processing SKU: ${sku}`, productConfig);
      
      // Validate price (convert to cents for comparison)
      const itemPrice = Math.round(parseFloat(item.price) * 100);
      const totalPrice = itemPrice * item.quantity;
      
      // Security check: verify price matches expected
      if (itemPrice !== productConfig.expectedPrice) {
        console.error(`❌ SECURITY: Price mismatch for SKU ${sku}!`);
        console.error(`Expected: ${productConfig.expectedPrice} cents, Got: ${itemPrice} cents`);
        
        // Create failed transaction record
        await storage.createShopifyTransaction({
          userId: user.id,
          shopifyOrderId: orderData.id.toString(),
          shopifyOrderNumber: orderData.order_number?.toString(),
          sku,
          productType: productConfig.type,
          amount: item.price,
          currency: orderData.currency || 'EUR',
          customerEmail,
          status: 'failed',
          questionsAdded: null,
          subscriptionPlan: null,
        });
        
        return {
          success: false,
          message: `Price mismatch for SKU ${sku}`
        };
      }
      
      // Process based on product type
      if (productConfig.type === 'prepaid_credits' && productConfig.questions) {
        // Add prepaid questions
        const questionsToAdd = productConfig.questions * item.quantity;
        await storage.addPrepaidQuestions(user.id, questionsToAdd);
        
        console.log(`✅ Added ${questionsToAdd} prepaid questions to user ${user.username}`);
        
        // Create transaction record
        const transaction = await storage.createShopifyTransaction({
          userId: user.id,
          shopifyOrderId: orderData.id.toString(),
          shopifyOrderNumber: orderData.order_number?.toString(),
          sku,
          productType: 'prepaid_credits',
          amount: item.price,
          currency: orderData.currency || 'EUR',
          customerEmail,
          status: 'completed',
          questionsAdded: questionsToAdd,
          subscriptionPlan: null,
        });
        
        console.log('✅ Shopify transaction created:', transaction.id);
        
      } else if (productConfig.type === 'subscription' && productConfig.plan) {
        // Activate subscription
        const expiresAt = new Date(Date.now() + (productConfig.durationDays || 30) * 24 * 60 * 60 * 1000);
        
        await storage.updateUserSubscription(user.id, {
          status: 'active',
          plan: productConfig.plan,
          subscriptionId: `shopify_${orderData.id}`,
          expiresAt,
        });
        
        console.log(`✅ Activated ${productConfig.plan} subscription for user ${user.username}`);
        console.log(`Expires at: ${expiresAt.toISOString()}`);
        
        // Create transaction record
        const transaction = await storage.createShopifyTransaction({
          userId: user.id,
          shopifyOrderId: orderData.id.toString(),
          shopifyOrderNumber: orderData.order_number?.toString(),
          sku,
          productType: 'subscription',
          amount: item.price,
          currency: orderData.currency || 'EUR',
          customerEmail,
          status: 'completed',
          questionsAdded: null,
          subscriptionPlan: productConfig.plan,
        });
        
        console.log('✅ Shopify transaction created:', transaction.id);
      }
    }
    
    return {
      success: true,
      message: 'Order processed successfully'
    };
    
  } catch (error) {
    console.error('❌ Error processing Shopify order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
