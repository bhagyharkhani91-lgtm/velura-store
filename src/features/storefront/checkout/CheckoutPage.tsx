import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../components/layout/Container/Container';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { useCartStore } from '../../../stores/cartStore';
import { useOrdersStore } from '../../../stores/ordersStore';
import { useAuthStore } from '../../../stores/authStore';
import { formatPrice } from '../../../utils';
import { CheckCircle } from 'lucide-react';
import { sendOrderConfirmationEmail } from '../../../utils/emailService';


export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { addOrder } = useOrdersStore();
  const { user } = useAuthStore();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const subtotal = getSubtotal();
  const shipping = items.reduce((total, item) => total + ((item.shippingCharge || 0) * item.quantity), 0);
  const total = subtotal + shipping;

  if (items.length === 0 && !isSuccess) {
    return (
      <Container className="py-20 text-center">
        <h1 className="heading-2xl mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate('/products')}>Return to Shop</Button>
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="bg-surface border border-border p-10 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-success-muted text-success rounded-full flex items-center justify-center">
              <CheckCircle size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-primary">Order Placed Successfully!</h1>
          <p className="text-secondary text-sm mb-8 leading-relaxed">
            Thank you for your discreet purchase. You will receive an email confirmation shortly. A message with your order details has been shared with you.
          </p>
          <Button onClick={() => navigate('/')} className="w-full">Return Home</Button>
        </div>
      </Container>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Load Razorpay script
    const res = await loadRazorpay();
    if (!res) {
      alert('Failed to load Razorpay SDK. Please check your connection.');
      return;
    }

    const receiptId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    let orderIdToUse = '';

    try {
      // 2. Call backend to create Razorpay Order
      // Using relative path for Vercel Serverless Function
      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, receipt: receiptId })
      }).catch(err => {
        console.warn("Backend fetch failed, proceeding with UI test mode only.", err);
        return null;
      });

      if (orderResponse && orderResponse.ok) {
        const orderData = await orderResponse.json();
        orderIdToUse = orderData.id;
      } else {
        console.warn("Please start the Supabase Edge function backend to create secure orders.");
      }

      // 3. Initialize Razorpay Checkout
      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TAzZYC15Rkxqdh', 
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Velura Store",
        description: "Premium Purchase",
        image: "https://example.com/your_logo.png",
        handler: function (response: any) {
          // Payment Succeeded!
          processSuccessfulOrder(receiptId, response.razorpay_payment_id, response.razorpay_order_id);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#c8a97e" // Accent color
        }
      };

      if (orderIdToUse) {
        options.order_id = orderIdToUse;
      }

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment Failed:", response.error);
        alert(`Payment Failed! Reason: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Error initiating payment.');
    }
  };

  const processSuccessfulOrder = (orderId: string, paymentId: string, rzpOrderId: string) => {
    const orderData = {
      id: orderId,
      orderNumber: orderId,
      items: items.map(item => ({
        ...item,
        variantId: item.variantId || 'default'
      })),
      subtotal,
      shipping: { method: 'Standard', cost: shipping, estimatedDays: '3-5 Days' },
      total,
      shippingAddress: { ...formData, country: 'India' },
    };

    addOrder({
      ...orderData,
      userId: user?.id || 'guest',
      tax: 0,
      discount: 0,
      status: 'pending',
      timeline: [{ status: 'pending', timestamp: new Date().toISOString() }],
      paymentMethod: 'Razorpay',
      razorpayOrderId: rzpOrderId || '',
      razorpayPaymentId: paymentId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    sendOrderConfirmationEmail(orderData);
    clearCart();
    setIsSuccess(true);
  };

  return (
    <Container className="py-12">
      <h1 className="heading-3xl mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePayment} className="space-y-8">
            {/* Contact Info */}
            <div className="bg-surface p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4 text-primary">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                <div className="md:col-span-2">
                  <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="md:col-span-2">
                  <Input label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-surface p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4 text-primary">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input label="Street Address" name="street" value={formData.street} onChange={handleInputChange} required />
                </div>
                <Input label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                <Input label="State" name="state" value={formData.state} onChange={handleInputChange} required />
                <Input label="Postal Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-surface p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4 text-primary">Payment</h2>
              <div className="p-4 border border-accent bg-accent-subtle rounded-md flex items-center justify-between cursor-pointer transition-colors hover:bg-bg-hover">
                <span className="font-medium text-primary">Razorpay (Cards, UPI, NetBanking)</span>
                <div className="w-4 h-4 rounded-full border border-accent bg-accent flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-bg-primary"></div>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Complete Order ({formatPrice(total)})
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface p-6 rounded-lg border border-border sticky top-24">
            <h2 className="text-xl font-semibold mb-6 text-primary">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-primary line-clamp-1">{item.name}</h4>
                    {item.variant && <p className="text-xs text-secondary">{item.variant}</p>}
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-secondary">Qty: {item.quantity}</span>
                      <span className="text-sm font-medium text-primary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Subtotal</span>
                <span className="text-primary">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Shipping</span>
                <span className="text-primary">{formatPrice(shipping)}</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 flex justify-between font-semibold text-lg">
              <span className="text-primary">Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
