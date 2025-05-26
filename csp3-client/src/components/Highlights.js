import { useState, useEffect } from 'react';
import { Carousel, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStore } from 'react-icons/fa';
import styles from './css/AppNavbar.module.css'; // or your preferred CSS module
import './css/CarouselCustom.css'; // Assuming CarouselCustom.css is in a 'css' subfolder relative to Highlights.js

export default function Highlights() {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products/active`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData = await response.json();

        if (!Array.isArray(apiData) || apiData.length === 0) {
          setPreviews([]);
          setLoading(false);
          return;
        }

        const numbers = new Set();
        const products = [];
        const numToShow = Math.min(5, apiData.length);

        while (numbers.size < numToShow) {
          numbers.add(Math.floor(Math.random() * apiData.length));
        }

        [...numbers].forEach((randomIndex) => {
          const productData = apiData[randomIndex];
          if (productData) {
            products.push(productData);
          }
        });

        setPreviews(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
        setPreviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-5 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-5 text-center text-danger">{error}</div>;
  }

  if (previews.length === 0) {
    return <div className="p-5 text-center">No active products to display.</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-center mb-4">Featured Products</h2>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10} xl={10}>
          <Carousel
            interval={5000}
            indicators={previews.length > 1}
            controls={previews.length > 1}
          >
            {previews.map(product => (
              <Carousel.Item key={product._id}>
                <div className="d-flex justify-content-center">
                  <img
                    src={product.image}
                    alt={product.name || "Product"}
                    style={{ maxHeight: "400px", width: "auto", objectFit: "contain" }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
          <div className="d-flex justify-content-center mt-4">
            <Button
              as={Link}
              to="/products"
              className={`${styles.navButton} btn btn-primary`}
            >
              <FaStore className="me-2" /> Products
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}