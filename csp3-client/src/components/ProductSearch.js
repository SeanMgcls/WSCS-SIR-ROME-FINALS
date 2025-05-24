import React, { useState } from 'react';
import Product from './Product';
import { Col, Card } from 'react-bootstrap';

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);

  // Unified handler: search for active products by name and/or price
  const handleSearch = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: searchQuery,
          minPrice: minPrice,
          maxPrice: maxPrice
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await response.json();
      // Always set an array, even if null or undefined
      setSearchResults(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error searching for products:', error);
      setError('An error occurred while searching for products. Please try again.');
      setSearchResults([]);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(100000);
    setSearchResults(null);
    setError(null);
  };

  return (
    <div className='pt-5 container'>
      <h2>Product Search</h2>
      <div className="form-group">
        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          id="productName"
          className="form-control"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="minPrice">Minimum Price:</label>
        <div className="input-group">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setMinPrice(prevMinPrice => Math.max(prevMinPrice - 1000, 0))}
          >-</button>
          <input
            type="number"
            id="minPrice"
            className="form-control"
            value={minPrice}
            onChange={event => setMinPrice(Number(event.target.value))}
          />
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setMinPrice(prevMinPrice => Math.min(prevMinPrice + 1000, maxPrice - 1000))}
          >+</button>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="maxPrice">Maximum Price:</label>
        <div className="input-group">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setMaxPrice(prevMaxPrice => Math.max(prevMaxPrice - 1000, minPrice + 1000))}
          >-</button>
          <input
            type="number"
            id="maxPrice"
            className="form-control"
            value={maxPrice}
            onChange={event => setMaxPrice(Number(event.target.value))}
          />
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setMaxPrice(prevMaxPrice => Math.min(prevMaxPrice + 1000, 100000))}
          >+</button>
        </div>
      </div>
      <button className="btn btn-primary my-4" onClick={handleSearch}>
        Search
      </button>
      <button className="btn btn-danger mx-2 my-4" onClick={handleClear}>
        Clear
      </button>
      {error && <p className="text-danger">{error}</p>}
      {searchResults !== null && (
        <>
          <h3>Search Results:</h3>
          {searchResults.length === 0 ? (
            <Col xs={12} md={12} className="mt-4">
              <Card className="card1">
                <Card.Body>
                  <Card.Title className="text-center card2">No matching products found</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <div className="row">
              {searchResults.map(product => (
                <Product data={product} key={product._id} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSearch;