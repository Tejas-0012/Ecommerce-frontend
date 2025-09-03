import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { normalizeApiResponse } from '../utils/apiHelpers';

// API Helper function


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log('Fetching product from:', `${apiUrl}/api/products/${id}/`);
        
        const response = await axios.get(`${apiUrl}/api/products/${id}/`, {
          timeout: 5000
        });
        
        console.log('API Response:', response);
        
        // USE THE API HELPER HERE
        const productData = normalizeApiResponse(response.data);
        console.log('Normalized product data:', productData);
        
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(err.message || 'Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Product Not Found</h2>
          <p className="text-gray-700 mb-4">{error || 'The requested product could not be found.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 md:p-8">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              ← Back to Products
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <img
                  src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'}
                  alt={product.name}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>

              <div className="md:w-1/2">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {product.category && (
                  <p className="text-gray-600 mb-2">
                    Category: <span className="font-medium">{product.category.name}</span>
                  </p>
                )}

                <p className="text-2xl font-bold text-blue-600 mb-6">${product.price}</p>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="input-field w-20"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full btn-primary py-3 text-lg"
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;