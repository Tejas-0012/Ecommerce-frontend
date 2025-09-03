import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Start shopping to add items to your cart</p>
            <Link
              to="/products"
              className="mt-6 inline-block btn-primary"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
            >
              Clear Cart
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div className="p-6 flex flex-col sm:flex-row items-center">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-blue-600 font-bold">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                    >
                      <span className="text-lg">-</span>
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                    >
                      <span className="text-lg">+</span>
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal</span>
              <span className="text-xl font-bold text-blue-600">${getCartTotal().toFixed(2)}</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">Shipping and taxes calculated at checkout.</p>
            
            <div className="space-y-4">
              <button className="w-full btn-primary py-3 text-lg">
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className="w-full btn-secondary py-3 text-lg text-center block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;