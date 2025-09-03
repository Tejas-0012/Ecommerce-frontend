import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchProducts } from '../utils/api';

const ApiTest = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApi = async () => {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error('API Test failed:', error);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return <div>Testing API connection...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Categories ({categories.length})</h3>
          <ul className="text-sm">
            {categories.map(cat => (
              <li key={cat.id}>• {cat.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Products ({products.length})</h3>
          <ul className="text-sm">
            {products.slice(0, 5).map(prod => (
              <li key={prod.id}>• {prod.name} (${prod.price})</li>
            ))}
            {products.length > 5 && <li>... and {products.length - 5} more</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;