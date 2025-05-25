import { useState, useEffect, useContext } from 'react';
import { Card, Container, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Link, useParams, useHistory } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function Specific() {
	const { user } = useContext(UserContext);
	const { productId } = useParams();
	const history = useHistory();

	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");
	const [qty, setQty] = useState(1);
	const [price, setPrice] = useState(0);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
			.then(res => res.json())
			.then(data => {
				setId(data._id);
				setName(data.name);
				setDescription(data.description);
				setImage(data.image);
				setPrice(data.price);
			});
	}, [productId]);

	const reduceQty = () => setQty(q => Math.max(1, q - 1));

	const handleQtyChange = (e) => {
		let value = e.target.value.replace(/\D/g, '');
		value = value === '' ? 1 : Math.max(1, parseInt(value, 10));
		setQty(value);
	};

	const addToCart = () => {
		fetch(`${process.env.REACT_APP_API_URL}/cart/addToCart`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify({
				productId: id,
				quantity: qty,
				subtotal: price * qty,
				productName: name,
				price,
			}),
		})
			.then(response => {
				if (response.ok) return response.json();
				throw new Error('Error adding item to cart');
			})
			.then(result => {
				Swal.fire({
					icon: 'success',
					title: 'Item added to cart successfully!',
					text: `Total items in cart: ${result.cart.cartItems.length}`,
				}).then(() => history.push('/products'));
			})
			.catch(error => {
				console.error('Caught an error:', error);
				Swal.fire({
					icon: 'error',
					title: 'Error adding item to cart',
					text: 'Please try again.',
				});
			});
	};

	return (
		<Container>
			<Card className="mt-5">
				<Card.Header className="bg-secondary text-white text-center pb-0">
					<h4>{name}</h4>
				</Card.Header>
				{image && (
					<Card.Img variant="top" src={image} alt={name} style={{ maxHeight: 300, objectFit: 'contain' }} />
				)}
				<Card.Body>
					<Card.Text>{description}</Card.Text>
					<h6>
						Price: <span className="text-warning">₱{price}</span>
					</h6>
					<h6>Quantity:</h6>
					<InputGroup className="qty mt-2 mb-1" style={{ maxWidth: 200 }}>
						<Button variant="secondary" onClick={reduceQty}>-</Button>
						<FormControl
							type="number"
							min="1"
							value={qty}
							onChange={handleQtyChange}
						/>
						<Button variant="secondary" onClick={() => setQty(qty + 1)}>+</Button>
					</InputGroup>
				</Card.Body>
				<Card.Footer>
					{user.id !== null ? (
						user.isAdmin ? (
							<Button variant="danger" block disabled>Admin can't Add to Cart</Button>
						) : (
							<Button variant="primary" block onClick={addToCart}>Add to Cart</Button>
						)
					) : (
						<Link className="btn btn-warning btn-block" to={{ pathname: '/login', state: { from: 'cart' } }}>
							Log in to Add to Cart
						</Link>
					)}
				</Card.Footer>
			</Card>
		</Container>
	);
}