import React from 'react';
import Highlights from '../Highlights'; // Import your existing Highlights component
import { Row, Col } from 'react-bootstrap';

export default function FeaturedProductsSection() {
    return (
        <div className="py-5">
            <h2 className="text-center display-5 fw-bold mb-4">Our Top Picks</h2>
            <p className="text-center lead mb-5 px-lg-5">
                Explore a handpicked selection of our most popular and highly-rated items. These are the products our customers love!
            </p>
            <Highlights /> {/* Your existing Highlights component */}
        </div>
    );
}