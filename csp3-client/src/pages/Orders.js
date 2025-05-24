import React, { useState, useEffect } from 'react';
import { Container, Card, Accordion } from 'react-bootstrap';
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
								Order #{index + 1} - Purchased on: {moment(item.purchasedOn).format("MM-DD-YYYY")} (Click for Details)
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