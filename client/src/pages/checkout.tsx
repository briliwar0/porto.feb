import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ productId, price }: { productId: number, price: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "Something went wrong with your payment",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
        setPaymentSuccess(true);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4 p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p className="text-muted-foreground">Thank you for your purchase. We'll be in touch shortly with next steps.</p>
        <Button className="mt-6" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-md bg-white/5 backdrop-blur-sm">
        <PaymentElement />
      </div>
      
      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="bg-gradient-to-r from-primary to-secondary text-white"
        >
          {isProcessing ? 'Processing...' : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price / 100)}`}
        </Button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [location] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();
  
  // Extract product ID and price from URL parameters
  const params = new URLSearchParams(location.split('?')[1] || '');
  const productId = Number(params.get('productId') || 0);
  const price = Number(params.get('price') || 0);
  const productName = params.get('name') || 'Product';
  
  useEffect(() => {
    if (!productId || !price) {
      setError("Invalid product information");
      setIsLoading(false);
      return;
    }
    
    // Create PaymentIntent as soon as the page loads
    setIsLoading(true);
    apiRequest("POST", "/api/create-payment-intent", { 
      productId,
      amount: price,
      productName
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create payment intent");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        toast({
          title: "Error",
          description: err.message || "Failed to initialize payment",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId, price, productName, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 pt-20">
      <header className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-sm z-50 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Febri Developer
          </Link>
        </div>
      </header>
      <div className="max-w-md mx-auto px-6 py-12 bg-card rounded-lg shadow-lg border">
        <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>
        
        {error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : clientSecret ? (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-md mb-6">
              <h2 className="font-medium mb-2">Order Summary</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{productName}</p>
                </div>
                <p className="font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price / 100)}
                </p>
              </div>
            </div>
  
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
              <CheckoutForm productId={productId} price={price} />
            </Elements>
          </div>
        ) : null}
      </div>
    </div>
  );
}