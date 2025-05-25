import React, { useState, useEffect } from 'react';
import { Container, InputGroup, Button, FormControl, Table } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function MyCart() {
	const history = useHistory();

	const [total, setTotal] = useState(0);
	const [cart, setCart] = useState([]);
	const [willRedirect, setWillRedirect] = useState(false);

	useEffect(() => {
		fetchCart();
	}, []);

	const fetchCart = () => {
		fetch(`${process.env.REACT_APP_API_URL}/cart/`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
		})
			.then(res => {
				if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
				return res.text();
			})
			.then((data) => {
				try {
					const jsonData = data ? JSON.parse(data) : { cartItems: [] };
					const cartItems = jsonData.cartItems || [];
					setCart(cartItems);
				} catch (error) {
					console.error('Error parsing JSON:', error);
				}
			})
			.catch((error) => console.error('Error fetching cart:', error));
	};

	useEffect(() => {
		let tempTotal = 0;
		cart.forEach((item) => {
			tempTotal += item.subtotal;
		});
		setTotal(tempTotal);
	}, [cart]);

	const updateQuantity = (productId, newQuantity) => {
		// Ensure newQuantity is a positive integer
		newQuantity = Math.max(1, parseInt(newQuantity, 10) || 1);

		fetch(`${process.env.REACT_APP_API_URL}/cart/updateQuantity`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				productId,
				newQuantity,
			})
		})
			.then((res) => res.json())
			.then(() => fetchCart())
			.catch((error) => console.error('Error updating quantity:', error));
	};

	const removeFromCart = (productId) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}/removeFromCart`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
					.then((response) => {
						if (!response.ok) throw new Error(`Failed to remove item from cart: ${response.status}`);
						return response.json();
					})
					.then(() => {
						Swal.fire({
							title: 'Deleted!',
							text: 'Your item has been deleted.',
							icon: 'success',
						});
						fetchCart();
					})
					.catch((error) => console.error('Error removing item from cart:', error));
			}
		});
	};

	const checkout = () => {
		fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					Swal.fire({
						position: "top-end",
						icon: "success",
						title: "Your order has been placed",
						showConfirmButton: false,
						timer: 1500,
					});
					// Use history.push or willRedirect, not both
					history.push('/orders');
				}
			})
			.catch((error) => console.error('Error during checkout:', error));
	};

	const clearCart = () => {
		fetch(`${process.env.REACT_APP_API_URL}/cart/clearCart`, {
			method: 'PUT',
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.cart) {
					setCart(data.cart.cartItems);
					setTotal(data.cart.totalPrice);
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Your cart has been cleared',
						showConfirmButton: false,
						timer: 1500,
					});
				}
			})
			.catch((error) => console.error('Error clearing cart:', error));
	};

	if (willRedirect) {
		return <Redirect to="/orders" />;
	}

	return (
		cart.length <= 0 ? (
			<div className="p-5 my-4 bg-light rounded text-center">
				<h3>
					Your cart is empty! <Link to="/products">Start shopping.</Link>
				</h3>
			</div>
		)
			: (
				<Container>
					<h2 className="text-center my-4">Your Shopping Cart</h2>
					<Table striped bordered hover responsive>
						<thead className="bg-secondary text-white">
							<tr>
								<th>Name</th>
								<th>Price</th>
								<th>Quantity</th>
								<th>Subtotal</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{cart.map((item) => (
								<tr key={item.productId}>
									<td>
										<Link to={`/products/${item.productId}`}>{item.productName}</Link>
									</td>
									<td>₱{item.price}</td>
									<td>
										{/* Mobile: simple input */}
										<InputGroup className="d-md-none">
											<FormControl
												type="number"
												min="1"
												value={item.quantity}
												onChange={(e) => updateQuantity(item.productId, e.target.value)}
											/>
										</InputGroup>
										{/* Desktop: minus/input/plus */}
										<InputGroup className="d-none d-md-flex w-50">
											<Button variant="secondary" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</Button>
											<FormControl
												type="number"
												min="1"
												value={item.quantity}
												onChange={(e) => updateQuantity(item.productId, e.target.value)}
											/>
											<Button variant="secondary" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
										</InputGroup>
									</td>
									<td>₱{item.subtotal}</td>
									<td className="text-center">
										<Button variant="danger" className="w-100" onClick={() => removeFromCart(item.productId)}>
											Remove
										</Button>
									</td>
								</tr>
							))}
							<tr>
								<td colSpan="3">
									<Button variant="success" className="w-100" onClick={checkout}>
										Checkout
									</Button>
								</td>
								<td colSpan="2">
									<h3>Total: ₱{total}</h3>
								</td>
							</tr>
						</tbody>
					</Table>
					<Button variant="danger" className="w-100" onClick={clearCart}>
						Clear Cart
					</Button>
				</Container>
			)
	);
}