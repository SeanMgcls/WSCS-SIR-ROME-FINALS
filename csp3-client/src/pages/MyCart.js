import React, { useState, useEffect } from 'react';
import { Container, InputGroup, Button, FormControl, Table } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function MyCart() {

	const history = useHistory();

	const [total, setTotal] = useState(0);
	const [cart, setCart] = useState([]);
	const [tableRows, setTableRows] = useState([]);
	const [willRedirect, setWillRedirect] = useState(false);

	// ============================================================
	// to render the Updated Cart

	useEffect(() => {
		fetchCart();
	}, []);


	const fetchCart = () => {
	  fetch(`${process.env.REACT_APP_API_URL}/cart/`, {
	    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
	  })
	    .then(res => {
	      if (!res.ok) {
	        throw new Error(`Failed to fetch cart: ${res.status}`);
	      }
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
	    .catch((error) => {
	      console.error('Error fetching cart:', error);
	    });
	};

	// ============================================================

	// ============================================================
	// Getting the Cart and set it to table rows
	useEffect(() => {
		setTableRows(
			cart.map((item) => (
				<tr key={item.productId}>
					<td>
						<Link to={`/products/${item.productId}`}>{item.productName}</Link>
					</td>

					<td>₱{item.price}</td>

					<td>
						<InputGroup className="d-md-none">
							<FormControl
								type="number"
								min="1"
								value={item.quantity}
								onChange={(e) => updateQuantity(item.productId, e.target.value)}
							/>
						</InputGroup>
						
						<InputGroup className="d-none d-md-flex w-50">
							<InputGroup.Prepend>
								<Button variant="secondary" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
								-
								</Button>
							</InputGroup.Prepend>

							<FormControl
								type="number"
								min="1"
								value={item.quantity}
								onChange={(e) => updateQuantity(item.productId, e.target.value)}
							/>

							<InputGroup.Append>
								<Button variant="secondary" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
								+
								</Button>
							</InputGroup.Append>
						</InputGroup>
					</td>

					<td>₱{item.subtotal}</td>
					
					<td className="text-center">
						<Button variant="danger" onClick={() => removeFromCart(item.productId)}>
						Remove
						</Button>
					</td>
				</tr>
				))
			);

			let tempTotal = 0;
				cart.forEach((item) => {
					tempTotal += item.subtotal;
			});

		setTotal(tempTotal);

	}, [cart]);
	// ============================================================

	// ============================================================
	//Update the quantity of items in cart
	const updateQuantity = (productId, newQuantity) => {
	  // Make a PUT request to the API endpoint to update the quantity
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
		.then((data) => {
			// Assuming the API response contains an 'updatedCart' field
			const { updatedCart, message } = data;

			// Handle the response or perform any necessary actions
			console.log(message);

			// After updating the quantity, you may want to fetch the updated cart
			fetchCart();
		})
		.catch((error) => {
			console.error('Error updating quantity:', error);
			// Handle the error if necessary
		});
	};
	// ============================================================

	// ============================================================
	const removeFromCart = (productId) => {
		fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}/removeFromCart`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to remove item from cart: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				// Display the confirmation modal
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
						Swal.fire({
							title: 'Deleted!',
							text: 'Your file has been deleted.',
							icon: 'success',
						});
						// After removing the item, fetch the updated cart
						fetchCart();
					}
				});
			})
			.catch((error) => {
				console.error('Error removing item from cart:', error);
				// Handle the error if necessary
			});
	};

	// ============================================================

	// ============================================================
	const checkout = () => {
		// Make a POST request to the API to initiate the checkout process
		fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
				// Handle the response or perform any necessary actions
				if (data) {
					Swal.fire({
						position: "top-end",
						icon: "success",
						title: "Your order has been placed",
						showConfirmButton: false,
						timer: 1500,
					});

					// Fetch the updated cart after successful checkout
					history.push('/orders')
				} 
			})
			.catch((error) => {
				console.error('Error during checkout:', error);
				// Handle the error if necessary
			});
	};

	// ============================================================

	const clearCart = () => {
		fetch(`${process.env.REACT_APP_API_URL}/cart/clearCart`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				// Handle the response or perform any necessary actions
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
			.catch((error) => {
				console.error('Error clearing cart:', error);
				// Handle the error if necessary
			});
	};


	return (
		willRedirect === true ? (
			<Redirect to="/orders" />
		) : (
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
							{tableRows}
							<tr>
								<td colSpan="3">
									<Button variant="success" block onClick={() => checkout()}>
									Checkout
									</Button>
								</td>

								<td colSpan="2">
									<h3>Total: ₱{total}</h3>
								</td>
							</tr>
						</tbody>
					</Table>
					<Button variant="danger" block onClick={clearCart}>
						Clear Cart
					</Button>
				</Container>
			)
		)
	);
}