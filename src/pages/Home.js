import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { normalizeApiResponse, safeMap } from '../utils/apiHelpers';


const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log('Fetching categories from:', `${apiUrl}/api/categories/`);
        
        const response = await axios.get(`${apiUrl}/api/categories/`, {
          timeout: 5000
        });
        
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        console.log('Response data type:', typeof response.data);
        
        // USE THE API HELPER HERE - This is the key change!
        const categoriesData = normalizeApiResponse(response.data);
        console.log('Normalized categories data:', categoriesData);
        
        if (categoriesData.length > 0) {
          setCategories(categoriesData);
          console.log('Categories set:', categoriesData.length, 'items');
        } else {
          console.error('No categories found in response');
          setError('No categories found in response');
          setCategories(getFallbackCategories());
        }
        
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
        setCategories(getFallbackCategories());
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fallback categories function
  const getFallbackCategories = () => {
    return [
      { id: 1, name: 'Electronics', slug: 'electronics' },
      { id: 2, name: 'Clothing', slug: 'clothing' },
      { id: 3, name: 'Books', slug: 'books' },
      { id: 4, name: 'Home & Kitchen', slug: 'home-kitchen' }
    ];
  };

  // USE safeMap INSTEAD OF categories.map - This fixes the error!
  const renderCategories = () => {
    return safeMap(categories, (category, index) => (
      <motion.div
        key={category.id || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
      >
        <Link
          to={`/products?category=${category.name}`}
          className="block card h-full p-6 text-center group"
        >
          <div className="mb-4 h-16 w-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {category.name || `Category ${index + 1}`}
          </h3>
          <p className="text-gray-600">Explore our collection</p>
        </Link>
      </motion.div>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to ShopNow
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover amazing products at unbeatable prices
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/products"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category {Array.isArray(categories) ? `(${categories.length})` : ''}
          </h2>
          
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <p>Note: {error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {renderCategories()}
          </div>
        </div>
      </section>
    </div>
  );
};


export default Home;