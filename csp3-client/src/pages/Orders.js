import React, { useState, useEffect } from 'react';
import { Container, Card, Accordion, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function Orders(){

	const [ordersList, setOrdersList] = useState([]);

	useEffect(()=> {

		fetch(`${ process.env.REACT_APP_API_URL}/orders/my-orders`, {
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			const { orders } = data;

			console.log(orders)

			
			const myOrders = orders.map((item, index) => {
				return(
					<Card key={item._id}>
							<Accordion.Toggle 
								as={Card.Header}
								eventKey={index + 1}
								className="bg-secondary text-white"
							>
								Order #{index + 1} - Purchased on: {moment(item.purchasedOn).format("MM-DD-YYYY")} (Click for Details)
							</Accordion.Toggle>
							<Accordion.Collapse eventKey={index + 1}>
								<Card.Body>
									<h6>Items:</h6>
									<ul>
									
										{
										item.productsOrdered.map((subitem) => {

											fetch(`${ process.env.REACT_APP_API_URL}/products/${subitem.productId}`)
											.then(res => res.json())
											.then(data => {
											});

											return (
												<li key={subitem._id}>
													{subitem.productName} - Quantity: {subitem.quantity}
												</li>
											);

										})

									}
											
									</ul>
									<h6>
										Total: <span className="text-warning">₱{item.totalPrice}</span>
									</h6>
								</Card.Body>
							</Accordion.Collapse>
						</Card>

					)
			})

			setOrdersList(myOrders)
			
		})

	}, []);



	return(
		ordersList.length === 0 ?
			<Jumbotron>
					<h3 className="text-center">
						No orders placed yet! <Link to="/products">Start shopping.</Link>
					</h3>
			</Jumbotron>
		:
		<Container>
			<h2 className="text-center my-4">Order History</h2>
			<Accordion>
				{ordersList}
			</Accordion>
		</Container>
	)
}
