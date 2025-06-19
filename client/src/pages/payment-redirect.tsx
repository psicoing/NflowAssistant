import { useEffect } from "react";
import { useLocation } from "wouter";

export default function PaymentRedirect() {
  const [location] = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get('orderId');
    const plan = searchParams.get('plan');
    
    if (orderId) {
      console.log("Redirecting to PayPal with order:", orderId);
      
      // Store payment info for return handling
      if (plan) {
        localStorage.setItem("paymentPlan", plan);
        localStorage.setItem("paymentOrderId", orderId);
      }
      
      // Direct redirect to PayPal sandbox
      const paypalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`;
      window.location.href = paypalUrl;
    } else {
      // No order ID, redirect back to pricing
      window.location.href = "/#precios";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirigiendo a PayPal...</h2>
        <p className="text-gray-600">Espera un momento mientras te llevamos al pago seguro.</p>
      </div>
    </div>
  );
}