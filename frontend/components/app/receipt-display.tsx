'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useDataChannel } from '@livekit/components-react';

interface ReceiptData {
  name: string;
  drinkType: string;
  size: string;
  milk: string;
  extras: string[];
  pricing: {
    base_price: number;
    extras_total: number;
    subtotal: number;
    tax: number;
    total: number;
  };
  timestamp: string;
}

export function ReceiptDisplay() {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [show, setShow] = useState(false);

  // Listen for data messages from the agent
  const { message } = useDataChannel();

  useEffect(() => {
    if (message) {
      try {
        const decoder = new TextDecoder();
        const text = decoder.decode(message.payload);
        const data = JSON.parse(text);
        
        if (data.type === 'receipt' && data.receipt) {
          setReceipt(data.receipt);
          setShow(true);
        }
      } catch (e) {
        console.error('Error parsing receipt data:', e);
      }
    }
  }, [message]);

  if (!show || !receipt) return null;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-20 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
        <h2 className="text-xl font-bold">☕ Order Receipt</h2>
        <p className="text-sm opacity-90">Brew & Bloom Coffee Shop</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
          <p className="font-semibold text-lg">{receipt.name}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {formatDate(receipt.timestamp)}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Order Details</h3>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {receipt.size.charAt(0).toUpperCase() + receipt.size.slice(1)}{' '}
                {receipt.drinkType.charAt(0).toUpperCase() + receipt.drinkType.slice(1)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                with {receipt.milk}
              </p>
            </div>
            <p className="font-mono">${receipt.pricing.base_price.toFixed(2)}</p>
          </div>

          {receipt.extras && receipt.extras.length > 0 && (
            <div className="pl-3 space-y-1 border-l-2 border-amber-500">
              {receipt.extras.map((extra, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <p className="text-gray-600 dark:text-gray-400">+ {extra}</p>
                  <p className="font-mono text-gray-600 dark:text-gray-400">
                    ${(receipt.pricing.extras_total / receipt.extras.length).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
            <p className="font-mono">${receipt.pricing.subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-gray-600 dark:text-gray-400">Tax (8%)</p>
            <p className="font-mono">${receipt.pricing.tax.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Total</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-500 font-mono">
              ${receipt.pricing.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-center">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            ✨ Thank you for your order!
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Your drink will be ready shortly
          </p>
        </div>

        <button
          onClick={() => setShow(false)}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
