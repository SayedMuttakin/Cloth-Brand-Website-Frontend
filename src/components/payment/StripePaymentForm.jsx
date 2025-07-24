import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useStripeContext } from '../../context/StripeContext';
import toast from 'react-hot-toast';

// Inner component that uses Stripe hooks
const PaymentFormInner = ({ 
  clientSecret, 
  onPaymentSuccess, 
  onPaymentError, 
  isLoading, 
  setIsLoading,
  orderData 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);

  // Remove the useEffect that shows initial error message
  // We only want to show messages after user attempts payment

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
        payment_method_data: {
          billing_details: {
            name: orderData.customerInfo.name,
            email: orderData.customerInfo.email,
            phone: orderData.customerInfo.phone,
            address: {
              line1: orderData.shippingAddress.street,
              city: orderData.shippingAddress.city,
              state: orderData.shippingAddress.state,
              postal_code: orderData.shippingAddress.zipCode,
              country: orderData.shippingAddress.country,
            },
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
        toast.error(error.message, {
          duration: 3000,
        });
        onPaymentError(error);
      } else {
        setMessage('An unexpected error occurred.');
        toast.error('An unexpected error occurred.', {
          duration: 3000,
        });
        onPaymentError(error);
      }
    } else {
      // Payment succeeded - let the parent component handle the success toast
      setMessage('Payment successful!');
      onPaymentSuccess();
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
    defaultValues: {
      billingDetails: {
        name: orderData.customerInfo.name,
        email: orderData.customerInfo.email,
        phone: orderData.customerInfo.phone,
        address: {
          line1: orderData.shippingAddress.street,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          postal_code: orderData.shippingAddress.zipCode,
          country: orderData.shippingAddress.country,
        },
      },
    },
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <CreditCardIcon className="h-5 w-5 text-indigo-500" />
        Payment Details
      </h3>
      
      {(!stripe || !elements) ? (
        <div className="text-center text-indigo-200/60 py-4">Loading payment form...</div>
      ) : (
        <form id="payment-form" onSubmit={handleSubmit}>
          <div className="mb-6">
            <PaymentElement 
              id="payment-element" 
              options={paymentElementOptions}
            />
          </div>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes('succeeded') 
                ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {message}
            </div>
          )}

          <button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            type="submit"
            className="group relative inline-flex items-center justify-center w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative flex items-center justify-center w-full h-full px-6 py-3 bg-gray-900 rounded-[0.7rem] group-hover:bg-opacity-0 transition-all duration-300">
              <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                <LockClosedIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-pulse">Processing Payment</span>
                    <span className="ml-1 animate-bounce">...</span>
                  </span>
                ) : (
                  'Pay Now'
                )}
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                <LockClosedIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-pulse">Processing Payment</span>
                    <span className="ml-1 animate-bounce">...</span>
                  </span>
                ) : (
                  'Pay Now'
                )}
              </span>
            </span>
          </button>
        </form>
      )}

      <div className="mt-4 flex items-center justify-center text-xs text-indigo-200/40">
        <LockClosedIcon className="h-4 w-4 mr-1" />
        Secured by Stripe
      </div>
    </div>
  );
};

// Main component that wraps with Elements
const StripePaymentForm = (props) => {
  const { stripePromise } = useStripeContext();
  
  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#1f2937',
      colorText: '#f9fafb',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        backgroundColor: 'rgba(31, 41, 55, 0.5)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        color: '#f9fafb',
      },
      '.Input:focus': {
        borderColor: '#6366f1',
        boxShadow: '0 0 0 1px #6366f1',
      },
      '.Label': {
        color: 'rgba(249, 250, 251, 0.6)',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
  };

  const options = {
    clientSecret: props.clientSecret,
    appearance,
  };

  if (!props.clientSecret) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 shadow-lg">
        <div className="text-center text-indigo-200/60">
          Loading payment form...
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormInner {...props} />
    </Elements>
  );
};

export default StripePaymentForm;