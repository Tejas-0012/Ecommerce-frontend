import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import { normalizeApiResponse, safeMap } from '../utils/apiHelpers';

// API Helper functions - Add these at the top of the file

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    max_price: searchParams.get('max_price') || '',
    search: searchParams.get('search') || '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.max_price) params.append('max_price', filters.max_price);
        if (filters.search) params.append('search', filters.search);

        console.log('Fetching products from:', `${apiUrl}/api/products/?${params}`);
        
        const response = await axios.get(`${apiUrl}/api/products/?${params}`, {
          timeout: 5000
        });
        
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        
        // USE THE API HELPER HERE
        const productsData = normalizeApiResponse(response.data);
        console.log('Normalized products data:', productsData);
        
        setProducts(productsData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.message);
        setLoading(false);
        setProducts(getFallbackProducts());
      }
    };

    fetchProducts();
  }, [filters]);

  // Fallback products function
  const getFallbackProducts = () => {
    return [
      {
        id: 1,
        name: 'Wireless Headphones',
        category: { name: 'Electronics' },
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      },
      {
        id: 2,
        name: 'Smartphone',
        category: { name: 'Electronics' },
        description: 'Latest smartphone with advanced features',
        price: 699.99,
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
      },
      {
        id: 3,
        name: 'Cotton T-Shirt',
        category: { name: 'Clothing' },
        description: 'Comfortable cotton t-shirt',
        price: 24.99,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
      }
    ];
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSearchParams(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: '', max_price: '', search: '' };
    setFilters(clearedFilters);
    setSearchParams(clearedFilters);
  };

  // USE safeMap for rendering products
  const renderProducts = () => {
    return safeMap(products, (product) => (
      <ProductCard key={product.id} product={product} />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filter button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="btn-primary w-full"
            >
              Show Filters
            </button>
          </div>

          {/* Filter Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Mobile filter overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setIsFilterOpen(false)}
              ></div>
              <div className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-white p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6">
              <SearchBar
                value={filters.search}
                onChange={(value) => handleFilterChange({ ...filters, search: value })}
              />
            </div>

            {error && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                <p>Note: {error}. Using demo products.</p>
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 btn-secondary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {renderProducts()}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;