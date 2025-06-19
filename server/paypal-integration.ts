/**
 * PayPal Integration for NFLOW - Clean Implementation
 * Handles subscription creation and verification without conflicts
 */

interface PayPalSubscription {
  id: string;
  status: 'APPROVAL_PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  plan_id: string;
  subscriber?: {
    email_address: string;
  };
}

interface PayPalPlan {
  id: string;
  name: string;
  status: 'CREATED' | 'INACTIVE' | 'ACTIVE';
}

export class PayPalIntegration {
  private clientId: string;
  private clientSecret: string;
  private baseURL: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    try {
      const response = await fetch(`${this.baseURL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`PayPal auth failed: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety
      
      return this.accessToken;
    } catch (error) {
      console.error('PayPal authentication error:', error);
      throw new Error('Failed to authenticate with PayPal');
    }
  }

  async verifySubscription(subscriptionId: string): Promise<PayPalSubscription> {
    const accessToken = await this.getAccessToken();
    
    try {
      const response = await fetch(`${this.baseURL}/v1/billing/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`PayPal subscription verification failed: ${response.status}`);
      }

      const subscription = await response.json();
      return subscription as PayPalSubscription;
    } catch (error) {
      console.error('PayPal subscription verification error:', error);
      throw new Error('Failed to verify PayPal subscription');
    }
  }

  async cancelSubscription(subscriptionId: string, reason: string = 'User requested cancellation'): Promise<void> {
    const accessToken = await this.getAccessToken();
    
    try {
      const response = await fetch(`${this.baseURL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: reason
        })
      });

      if (!response.ok) {
        throw new Error(`PayPal subscription cancellation failed: ${response.status}`);
      }
    } catch (error) {
      console.error('PayPal subscription cancellation error:', error);
      throw new Error('Failed to cancel PayPal subscription');
    }
  }

  async createProduct(name: string, description: string): Promise<string> {
    const accessToken = await this.getAccessToken();
    
    try {
      const response = await fetch(`${this.baseURL}/v1/catalogs/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: description,
          type: 'SERVICE',
          category: 'SOFTWARE'
        })
      });

      if (!response.ok) {
        throw new Error(`PayPal product creation failed: ${response.status}`);
      }

      const product = await response.json();
      return product.id;
    } catch (error) {
      console.error('PayPal product creation error:', error);
      throw new Error('Failed to create PayPal product');
    }
  }

  async createPlan(productId: string, name: string, price: string): Promise<string> {
    const accessToken = await this.getAccessToken();
    
    try {
      const response = await fetch(`${this.baseURL}/v1/billing/plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          name: name,
          description: `${name} subscription plan`,
          billing_cycles: [{
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1
            },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0, // Infinite
            pricing_scheme: {
              fixed_price: {
                value: price,
                currency_code: 'EUR'
              }
            }
          }],
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee_failure_action: 'CONTINUE',
            payment_failure_threshold: 3
          }
        })
      });

      if (!response.ok) {
        throw new Error(`PayPal plan creation failed: ${response.status}`);
      }

      const plan = await response.json();
      return plan.id;
    } catch (error) {
      console.error('PayPal plan creation error:', error);
      throw new Error('Failed to create PayPal plan');
    }
  }
}

export const paypalIntegration = new PayPalIntegration();