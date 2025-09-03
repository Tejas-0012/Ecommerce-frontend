import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(filters.max_price || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log('Fetching categories for filter:', `${apiUrl}/api/categories/`);
        
        const response = await axios.get(`${apiUrl}/api/categories/`, {
          timeout: 5000
        });
        
        console.log('Categories API Response:', response.data);
        
        // ⭐⭐⭐ Handle different API response structures ⭐⭐⭐
        let categoriesData = response.data;
        
        // Case 1: If Django REST framework pagination (has "results" property)
        if (response.data && response.data.results) {
          categoriesData = response.data.results;
          console.log('Using results from paginated response');
        }
        // Case 2: If response has "data" property
        else if (response.data && response.data.data) {
          categoriesData = response.data.data;
          console.log('Using data from nested response');
        }
        
        // Make sure it's always an array
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
          console.log('Filter categories set:', categoriesData.length, 'items');
        } else {
          console.error('Expected array but got:', typeof categoriesData, categoriesData);
          setError('Invalid categories format');
          // Use fallback categories
          setCategories([
            { id: 1, name: 'Electronics', slug: 'electronics' },
            { id: 2, name: 'Clothing', slug: 'clothing' },
            { id: 3, name: 'Books', slug: 'books' },
            { id: 4, name: 'Home & Kitchen', slug: 'home-kitchen' }
          ]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch categories for filter:', err);
        setError(err.message);
        // Use fallback categories when API fails
        setCategories([
          { id: 1, name: 'Electronics', slug: 'electronics' },
          { id: 2, name: 'Clothing', slug: 'clothing' },
          { id: 3, name: 'Books', slug: 'books' },
          { id: 4, name: 'Home & Kitchen', slug: 'home-kitchen' }
        ]);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryName) => {
    onFilterChange({
      ...filters,
      category: filters.category === categoryName ? '' : categoryName,
    });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPriceRange(value);
    onFilterChange({
      ...filters,
      max_price: value,
    });
  };

  const handleClearFilters = () => {
    setPriceRange('');
    onClearFilters();
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
          <p>Using demo categories: {error}</p>
        </div>
      )}

      {/* Categories Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-700">Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.length > 0 ? (
            categories.map((category) => (
              <label key={category.id} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.category === category.name}
                  onChange={() => handleCategoryChange(category.name)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                  {category.name}
                </span>
                {filters.category === category.name && (
                  <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Active
                  </span>
                )}
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-700">Price Range</h3>
          <span className="text-sm text-blue-600">${priceRange}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={priceRange}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>$0</span>
          <span>$500</span>
          <span>$1000</span>
        </div>
        
        {priceRange > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
            <p className="text-blue-700">Showing products under ${priceRange}</p>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(filters.category || filters.max_price) && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h4 className="text-sm font-medium mb-2 text-gray-700">Active Filters:</h4>
          <div className="space-y-1">
            {filters.category && (
              <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                Category: {filters.category}
                <button
                  onClick={() => handleCategoryChange(filters.category)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.max_price && (
              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Max Price: ${filters.max_price}
                <button
                  onClick={() => {
                    setPriceRange('');
                    onFilterChange({ ...filters, max_price: '' });
                  }}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default FilterSidebar;