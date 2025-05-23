// components/IntroSection.js (No changes needed here for the background)
import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function IntroSection() {
    return (
        <Row className="text-center py-5"> {/* Keep py-5 for internal vertical spacing */}
            <Col>
                {/* Text content remains the same */}
                <h1 className="display-4 fw-bold mb-4">Your One-Stop Shop for Everything Unique!</h1>
                <p className="lead mb-4">
                    At **The UA Shop**, we're passionate about bringing you a curated selection of products that blend quality, innovation, and style. From the latest gadgets to handmade crafts, find what you love, discover something new, and enjoy a seamless shopping experience.
                </p>
                <p className="lead">
                    We believe in **products for everyone, everywhere.**
                </p>
            </Col>
        </Row>
    );
}