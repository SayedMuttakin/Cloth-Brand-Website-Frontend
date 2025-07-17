import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircleIcon,
  TruckIcon,
  CreditCardIcon,
  EnvelopeIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { paymentService } from '../../services/paymentService';
import toast from 'react-hot-toast';

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [paymentStatus, setPaymentStatus] = useState('completed');
  
  // Get payment intent from URL params (for Stripe redirects)
  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    // Handle Stripe payment confirmation if redirected from Stripe
    if (paymentIntent && redirectStatus === 'succeeded') {
      toast.success('Payment successful!');
      setPaymentStatus('completed');
    } else if (paymentIntent && redirectStatus === 'failed') {
      toast.error('Payment failed. Please try again.');
      setPaymentStatus('failed');
    }
  }, [paymentIntent, redirectStatus]);

  return (
    <div className="relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-8">
            <CheckCircleIcon className="h-12 w-12 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {paymentStatus === 'failed' ? 'Payment Failed' : 'Order Confirmed!'}
          </h1>
          
          {paymentStatus === 'failed' ? (
            <p className="text-red-400 text-lg mb-8">
              Your payment could not be processed. Please try again or contact support.
            </p>
          ) : (
            <p className="text-indigo-200/60 text-lg mb-8">
              Thank you for your purchase! Your order has been successfully placed and is being processed.
            </p>
          )}
        </div>

        {paymentStatus !== 'failed' && (
          <>
            {/* Order Status Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Order Status */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Order Status</h3>
                    <p className="text-indigo-200/60 text-sm">Confirmed & Processing</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-1/3"></div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                    <CreditCardIcon className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Payment</h3>
                    <p className="text-indigo-200/60 text-sm">
                      {paymentIntent ? 'Card Payment' : 'Cash on Delivery'}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full w-full"></div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <TruckIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Shipping</h3>
                    <p className="text-indigo-200/60 text-sm">Preparing for shipment</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/10 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">What happens next?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <EnvelopeIcon className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Order Confirmation Email</h3>
                    <p className="text-indigo-200/60">You'll receive an email confirmation with your order details and tracking information.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TruckIcon className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Processing & Shipping</h3>
                    <p className="text-indigo-200/60">Your order will be processed within 1-2 business days and shipped to your address.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircleIcon className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Delivery</h3>
                    <p className="text-indigo-200/60">Your package will be delivered within 3-7 business days depending on your location.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium"
          >
            <span className="relative flex items-center justify-center w-full h-full px-8 py-3 bg-gray-900 rounded-[0.7rem] group-hover:bg-opacity-0 transition-all duration-300">
              Continue Shopping
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </span>
          </Link>

          {paymentStatus === 'failed' && (
            <Link
              to="/checkout"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-0.5 font-medium"
            >
              <span className="relative flex items-center justify-center w-full h-full px-8 py-3 bg-gray-900 rounded-[0.7rem] group-hover:bg-opacity-0 transition-all duration-300">
                Try Again
              </span>
            </Link>
          )}

          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-8 py-3 border border-indigo-500/20 rounded-xl text-indigo-200/60 hover:text-white hover:border-indigo-500 transition-all duration-300"
          >
            View Orders
          </Link>
        </div>

        {/* Support Information */}
        <div className="text-center mt-12 pt-8 border-t border-indigo-500/10">
          <p className="text-indigo-200/60 mb-2">Need help with your order?</p>
          <Link
            to="/contact"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;