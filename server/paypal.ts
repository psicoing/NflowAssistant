/**
 * PayPal integration for NFLOW subscriptions
 */

interface PayPalSubscription {
  id: string;
  status: string;
  plan_id: string;
  subscriber: {
    email_address: string;
  };
}

interface PayPalPlan {
  id: string;
  name: string;
  description: string;
}

export class PayPalService {
  private clientId: string;
  private clientSecret: string;
  private baseURL: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_SECRET || '';
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await fetch(`${this.baseURL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
  }

  async verifySubscription(subscriptionId: string): Promise<PayPalSubscription> {
    const accessToken = await this.getAccessToken();
    
    const response = await fetch(`${this.baseURL}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify subscription');
    }

    return await response.json();
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    
    const response = await fetch(`${this.baseURL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'User requested cancellation'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
  }
}

export const paypalService = new PayPalService();