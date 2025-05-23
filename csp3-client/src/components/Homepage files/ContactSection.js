import React from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';


export default function ContactSection() {
    return (
        <div className="py-5">
            <h2 className="text-center display-5 fw-bold mb-5">Get in Touch</h2>
            <Row className="justify-content-center">
                <Col md={6} className="mb-4 mb-md-0">
                    <p className="lead mb-4">
                        Have questions, feedback, or just want to say hello? We'd love to hear from you!
                        Fill out the form below or reach us directly.
                    </p>
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <FaEnvelope className="me-3 text-primary" size={20} />
                            <a href="mailto:info@uashop.com" className="text-decoration-none text-dark">info@uashop.com</a>
                        </li>
                        <li className="mb-3">
                            <FaPhone className="me-3 text-success" size={20} />
                            <a href="tel:+1234567890" className="text-decoration-none text-dark">+1 (234) 567-890</a>
                        </li>
                        <li className="mb-3">
                            <FaMapMarkerAlt className="me-3 text-info" size={20} />
                            123 E-Commerce St, Shop City, SC 12345
                        </li>
                    </ul>
                    <div className="mt-4">
                        <h5 className="fw-bold mb-3">Follow Us:</h5>
                        <a href="https://facebook.com/uashop" target="_blank" rel="noopener noreferrer" className="me-3 text-dark">
                            <FaFacebook size={30} />
                        </a>
                        <a href="https://twitter.com/uashop" target="_blank" rel="noopener noreferrer" className="me-3 text-dark">
                            <FaTwitter size={30} />
                        </a>
                        <a href="https://instagram.com/uashop" target="_blank" rel="noopener noreferrer" className="text-dark">
                            <FaInstagram size={30} />
                        </a>
                    </div>
                </Col>
                <Col md={6}>
                    <Card className="p-4 shadow-lg">
                        <Card.Body>
                            <h4 className="card-title mb-4">Send us a message</h4>
                            <Form>
                                <Form.Group className="mb-3" controlId="contactForm.name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Your Name" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="contactForm.email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="name@example.com" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="contactForm.message">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Your message here..." />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}