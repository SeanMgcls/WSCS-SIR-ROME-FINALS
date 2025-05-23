import React, { useEffect, useState, useContext } from 'react';
import { Form, Table, Button, Modal, Accordion, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function AdminView(){

	const { user } = useContext(UserContext);

	const [products, setProducts] = useState([]);
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [showAdd, setShowAdd] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [toggle, setToggle] = useState(false);
	const [ordersList, setOrdersList] = useState([]);

	const openAdd = () => setShowAdd(true);
	const closeAdd = () => setShowAdd(false);

	const openEdit = (productId) => {

		setId(productId);

		fetch(`${ process.env.REACT_APP_API_URL }/products/${ productId }`)
		.then(res => res.json())
		.then(data => {
			setName(data.name);
			setDescription(data.description);
			setPrice(data.price);
		});

		setShowEdit(true);

	};

	const closeEdit = () => {

		setName("");
		setDescription("");
		setPrice(0);
		setShowEdit(false);

	};

	const addProduct = (e) => {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/products`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price
			})
		})
		.then(res => res.json())
		.then(data => {

			if (data === true) {

				Swal.fire({
		          position: "top-end",
		          icon: "success",
		          title: "Product successfully added.",
		          showConfirmButton: false,
		          timer: 1500,
		        });
				
				setName("");
				setDescription("");
				setPrice(0);
				closeAdd();

			} else {

				Swal.fire({
		          position: "top-end",
		          icon: "error",
		          title: "Something went wrong.",
		          showConfirmButton: false,
		          timer: 1500,
		        });
			
				closeAdd();

			}

		});

	};

	const editProduct = (e, productId) => {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/products/${ productId }`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price
			})

		})
		.then(res => res.json())
		.then(data => {

			if (data.message === 'Product updated successfully') {

				Swal.fire({
		          position: "top-end",
		          icon: "success",
		          title: "Product successfully updated.",
		          showConfirmButton: false,
		          timer: 1500,
		        });
				
				setName("");
				setDescription("");
				setPrice(0);
				closeEdit();

			} else {

				Swal.fire({
		          position: "top-end",
		          icon: "error",
		          title: "Something went wrong.",
		          showConfirmButton: false,
		          timer: 1500,
		        });
				closeEdit();

			}

		});

	};


	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		.then((res) => res.json())
		.then((data) => {
      // console.log(data);

			let ordersArray = [];

			if (data && data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
				ordersArray = data.orders;
			} else if (data && data.order) {
        // If there is a single order, create an array with that order
				ordersArray = [data.order];
			} else {
				console.error('Invalid or empty JSON data in response:', data);
			}

			const allOrders = ordersArray.map((order, index) => {
				return (
					<Card key={order._id}>
					<Accordion.Toggle 
					as={Card.Header}
					eventKey={index + 1}
					className="bg-secondary text-white"
					>
					Orders for user <span className="text-warning">{order.userId}</span>
					</Accordion.Toggle>
					<Accordion.Collapse eventKey={index + 1}>
					<Card.Body>
					{order.productsOrdered.length > 0 ? (
						order.productsOrdered.map((product) => (
							<div key={product._id}>
							<h6>Purchased on {moment(order.orderedOn).format("MM-DD-YYYY")}:</h6>
							<ul>
							<li>
							{product.productName} - Quantity: {product.quantity}
							</li>
							</ul>
							<h6>Total: <span className="text-warning">₱{order.totalPrice}</span></h6>
							<hr/>
							</div>
							))
						) : (
						<span>No orders for this user yet.</span>
						)}
						</Card.Body>
						</Accordion.Collapse>
						</Card>
						);
			});

			setOrdersList(allOrders);
		})
		.catch((error) => {
			console.error('Error fetching orders:', error);
		});
	}, []);





	const toggler = () => {

		if(toggle === true){
			setToggle(false);
		}else{
			setToggle(true);
		}

	};

	useEffect(() => {

		const activateProduct = (productId) => {

			fetch(`${process.env.REACT_APP_API_URL}/products/${ productId }/activate`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${ localStorage.getItem('token') }`,
				}
			})
			.then(res => res.json())
			.then(data => {
				if (data.message === 'Product activated successfully') {
					
					Swal.fire({
			          position: "top-end",
			          icon: "success",
			          title: "Product successfully activated.",
			          showConfirmButton: false,
			          timer: 1500,
			        });
					
				} else {
					Swal.fire({
			          position: "top-end",
			          icon: "error",
			          title: "Something went wrong.",
			          showConfirmButton: false,
			          timer: 1500,
			        });
				}

			});

		};

		const archiveProduct = (productId) => {

			fetch(`${process.env.REACT_APP_API_URL}/products/${ productId }/archive`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${ localStorage.getItem('token') }`,
				}
			})
			.then(res => res.json())
			.then(data => {

				if (data.message === 'Product archived successfully') {
					
					Swal.fire({
			          position: "top-end",
			          icon: "success",
			          title: "Product successfully archived",
			          showConfirmButton: false,
			          timer: 1500,
			        });
				} else {
					Swal.fire({
			          position: "top-end",
			          icon: "error",
			          title: "Something went wrong.",
			          showConfirmButton: false,
			          timer: 1500,
			        });
				}

			});

		};


		
		fetch(`${ process.env.REACT_APP_API_URL}/products/all`, {
            headers: { Authorization: `Bearer ${ localStorage.getItem('token') }`}
        })
		.then(res => res.json())
		.then(data => {

			const productsArr = data.map(productData => {
				return (

					<tr key={productData._id}>
						<td>
						<Link to={`/products/${productData._id}`}>{
							productData.name}
						</Link>
					</td>
					<td>{productData.description}</td>
					<td>{productData.price}</td>
					<td>
						{ productData.isActive ?
								<span className="text-success">Available</span>
							:
								<span className="text-danger">Unavailable</span>
						}
					</td>
					<td>
						<Button 
							variant="primary" 
							size="sm" 
							onClick={() => openEdit(productData._id)}
						>
							Update
						</Button>
						{ productData.isActive ?
								<Button 
									variant="danger"
									size="sm"
									onClick={() => archiveProduct(productData._id)}
								>
									Disable
								</Button>
							:
								<Button
									variant="success"
									size="sm"
									onClick={() => activateProduct(productData._id)}
								>
								 	Enable
								</Button>
						}
					</td>
					</tr>
					)

			})
			setProducts(productsArr);
		})

		

	}, [products])


	return(
		<React.Fragment>
			<div className="text-center my-4">
				<h2>Admin Dashboard</h2>
				<div className="d-flex justify-content-center">
					<Button 
						className="mr-1"
						variant="primary"
						onClick={openAdd}
					>
						Add New Product
					</Button>
					{ toggle === false ? 
						<Button variant="success" onClick={()=> toggler()}>
							Show User Orders
						</Button>
					: 
						<Button variant="danger" onClick={()=> toggler()}>
							Show Product Details
						</Button>
					}
					
				</div>
			</div>
			{ toggle === false ?
				<Table striped bordered hover responsive>
					<thead className="bg-secondary text-white">
						<tr>
							<th>Name</th>
							<th>Description</th>
							<th>Price</th>
							<th>Availability</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products}
					</tbody>						
				</Table>
			:
				<Accordion>
					{ordersList}
				</Accordion>
			}

			<Modal show={showAdd} onHide={closeAdd}>
				<Form onSubmit={e => addProduct(e)}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Product</Modal.Title>
					</Modal.Header>
					<Modal.Body>

							<Form.Group controlId="productName">
								<Form.Label>Name:</Form.Label>
								<Form.Control 
									type="text"
									placeholder="Enter product name"
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId="productDescription">
								<Form.Label>Description:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter product description"
									value={description}
									onChange={e => setDescription(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId="productPrice">
								<Form.Label>Price:</Form.Label>
								<Form.Control
									type="number"
									value={price}
									onChange={e => setPrice(e.target.value)}
									required
								/>
							</Form.Group>

					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={closeAdd}>
							Close
						</Button>
						<Button variant="success" type="submit">
							Submit
						</Button>
					</Modal.Footer>

				</Form>	
			</Modal>

			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editProduct(e, id)}>
					<Modal.Header closeButton>
						<Modal.Title>Edit Product</Modal.Title>
					</Modal.Header>
					<Modal.Body>

							<Form.Group controlId="productName">
								<Form.Label>Name:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter product name"
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId="productDescription">
								<Form.Label>Description:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter product description"
									value={description}
									onChange={e => setDescription(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId="productPrice">
								<Form.Label>Price:</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter product price"
									value={price}
									onChange={e => setPrice(e.target.value)}
									required
								/>
							</Form.Group>

					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={closeEdit}>
							Close
						</Button>
						<Button variant="success" type="submit">
							Submit
						</Button>
					</Modal.Footer>
				</Form>	
			</Modal>
		</React.Fragment>
	);
	
}
