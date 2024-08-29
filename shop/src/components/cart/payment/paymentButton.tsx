import { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';

interface RazorpayPaymentProps {
  amount: number;
}

const RazorpayPayment = ({ amount }: RazorpayPaymentProps) => {
  const [initialized, setInitialized] = useState(false);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setInitialized(true);
    document.head.appendChild(script);
  };

  const initializeRazorpay = async () => {
    const amountInPaise = Math.round(amount * 100); // Convert amount to paise
    console.log('Amount in paise:', amountInPaise); // Console log the amount in paise

    // Create an order in your backend
    const response = await axios.post('razorpay-payment')

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount:amountInPaise,
      currency: 'INR',
      name: 'GeekyAnts official',
      description: 'Razorpay payment',
      image: '/images/logo-icon.png',
      order_id: '', // Add order ID here
      prefill: {
        name: 'ABC',
        email: 'abc@gmail.com',
      },
      theme: {
        color: '',
      },
      handler: function(response: any) {
        // Handle success
        console.log(response);
      },
      preOpen: function() {
        // Handle pre-open
      },
      modal: {
        ondismiss: function() {
          // Handle modal dismissal
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  return (
    <>
      <Head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Head>
      <div className="container">
        <div className="text-center">
          {!initialized && <p>Loading Razorpay...</p>}
          {initialized && (
            <button onClick={initializeRazorpay}>
              <p className='text-lg text-light px-7 rounded-lg py-2 bg-brand'>Pay now</p>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default RazorpayPayment;
