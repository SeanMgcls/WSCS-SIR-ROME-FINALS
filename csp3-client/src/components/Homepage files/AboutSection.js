import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaGlobe, FaHandshake, FaHeart } from 'react-icons/fa'; // Example icons

export default function AboutSection() {
    return (
        <div className="py-5">
            <h2 className="text-center display-5 fw-bold mb-5">About The UA Shop</h2>
            <Row className="justify-content-center g-4">
                <Col md={4}>
                    <Card className="h-100 text-center p-3 shadow-sm">
                        <Card.Body>
                            <FaGlobe size={50} className="mb-3 text-primary" />
                            <Card.Title className="h4 fw-bold">Our Vision</Card.Title>
                            <Card.Text>
                                To be the leading online destination for unique and high-quality products, connecting global artisans and brands with customers worldwide.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 text-center p-3 shadow-sm">
                        <Card.Body>
                            <FaHandshake size={50} className="mb-3 text-success" />
                            <Card.Title className="h4 fw-bold">Our Mission</Card.Title>
                            <Card.Text>
                                To provide an unparalleled shopping experience through a diverse catalog, secure transactions, and exceptional customer service.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 text-center p-3 shadow-sm">
                        <Card.Body>
                            <FaHeart size={50} className="mb-3 text-danger" />
                            <Card.Title className="h4 fw-bold">Our Values</Card.Title>
                            <Card.Text>
                                We are committed to transparency, customer satisfaction, and fostering a community that loves quality and innovation.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}