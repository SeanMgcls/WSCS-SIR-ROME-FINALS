import React, { useState, useEffect } from 'react';
import { Container, Card, Accordion, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function Orders() {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/orders/my-orders`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
			.then(res => res.json())
			.then(data => {
				setOrders(data.orders || []);
			});
	}, []);

	// Helper to get badge for status
	const getStatusBadge = (status) => {
		switch (status) {
			case "pending":
				return <Badge bg="secondary" className="ms-2">Pending</Badge>;
			case "on_delivery":
				return <Badge bg="info" text="dark" className="ms-2">On Delivery</Badge>;
			case "completed":
				return <Badge bg="success" className="ms-2">Completed</Badge>;
			case "cancelled":
				return <Badge bg="danger" className="ms-2">Cancelled</Badge>;
			default:
				return null;
		}
	};

	return (
		orders.length === 0 ? (
			<div className="p-5 my-4 bg-light rounded text-center">
				<h3>
					No orders placed yet! <Link to="/products">Start shopping.</Link>
				</h3>
			</div>
		) : (
			<Container>
				<h2 className="text-center my-4">Order History</h2>
				<Accordion>
					{orders.map((item, index) => (
						<Accordion.Item eventKey={index.toString()} key={item._id}>
							<Accordion.Header>
								Order #{index + 1} - Purchased on: {moment(item.purchasedOn || item.orderedOn).format("MM-DD-YYYY")}
								{getStatusBadge(item.status)}
							</Accordion.Header>
							<Accordion.Body>
								<h6>Items:</h6>
								<ul>
									{item.productsOrdered.map(subitem => (
										<li key={subitem._id}>
											{subitem.productName} - Quantity: {subitem.quantity}
										</li>
									))}
								</ul>
								<h6>
									Total: <span className="text-warning">₱{item.totalPrice}</span>
								</h6>
							</Accordion.Body>
						</Accordion.Item>
					))}
				</Accordion>
			</Container>
		)
	);
}