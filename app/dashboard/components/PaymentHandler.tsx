import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PaymentHandlerProps {
  leadId: string;
  leadName: string;
  onPaymentSuccess: (leadId: string) => void;
}

const PaymentHandler: React.FC<PaymentHandlerProps> = ({ leadId, leadName, onPaymentSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localStorage.getItem("access_token");


  const loadScript = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const showSuccessToast = (orderId: string, signature: string) => {
    toast.success(
      ({ closeToast }) => (
        <div>
          <p className="font-bold mb-2">Payment Successful!</p>
          <p>Thank you for your purchase.</p>
          <p className="mt-2"><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Signature:</strong> {signature.substring(0, 10)}...</p>
          <button
            onClick={closeToast}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Okay
          </button>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!res) {
        setError('Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }

      const orderResponse = await axios.post(
        'https://api.legalbooks.in/api/v1/payment/create/',
        {
          amount: 100 * 100, 
          content_type: 21,  
          content: leadId
        }, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true,
        }
      );

      if (!orderResponse.data.status || !orderResponse.data.data) {
        throw new Error('Invalid response from server');
      }

      const options: any = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_ilJ5HTUVx3aAX2',
        amount: orderResponse.data.data.amount,
        currency: 'INR',
        name: 'LegalBooks',
        description: `Payment for lead: ${leadName}`,
        order_id: orderResponse.data.data.id,
        handler: async function (response: any) {
          console.log('Signature:', response.razorpay_signature);
          console.log('Order ID:', response.razorpay_order_id);
          console.log('Payment ID:', response.razorpay_payment_id);
          console.log('Response:', response)

          try {
            const verificationResponse = await axios.post(
              'https://api.legalbooks.in/api/v1/payment/verify/',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                withCredentials: true,
              }
            );

            console.log('Verification Response:', verificationResponse.data);

            if (verificationResponse.data.status) {
              onPaymentSuccess(leadId);
              showSuccessToast(response.razorpay_order_id, response.razorpay_signature);
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Lawyer Name',
          email: 'lawyer@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Legal Office'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error creating order:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setError('Access forbidden. Please check your authentication and permissions.');
        } else if (error.response?.status === 401) {
          setError('Unauthorized access. Please check your API credentials or log in again.');
        } else {
          setError(`Failed to create order. ${error.response?.data?.message || 'Please try again or contact support.'}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again or contact support.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`px-4 py-2 text-xs rounded-md text-white font-medium transition-colors duration-200 ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Processing...' : 'Buy Lead'}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      <ToastContainer />
    </div>
  );
};

export default PaymentHandler;