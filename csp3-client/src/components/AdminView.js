import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Table,
    Button,
    Modal,
    Accordion,
    Card,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

// Import a CSS module for custom admin styles (create this file)
import styles from './css/admindashboard/AdminView.module.css';

export default function AdminView() {
    const { user } = useContext(UserContext);

    const [products, setProducts] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
    const [ordersList, setOrdersList] = useState([]);
    const [image, setImage] = useState(""); 
    const [searchTerm, setSearchTerm] = useState(''); // For product search

   // Helper function to fetch all products and filter out archived ones
        const fetchAllProducts = useCallback(() => {
            fetch(`${process.env.REACT_APP_API_URL}/products/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Only keep products where isActive is true (not archived)
                    const activeProducts = data.filter(product => product.isActive);
                    setProducts(activeProducts);
                } else {
                    console.error("Expected an array of products, but got:", data);
                    setProducts([]);
                }
            })
            .catch(error => {
                console.error("Error fetching all products:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to load products. Please try again later.",
                });
            });
        }, []);

    // Helper function to fetch all orders
            const fetchAllOrders = useCallback(() => {
            fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((res) => res.json())
            .then((data) => {
                let fetchedOrders = [];
                if (data && data.orders && Array.isArray(data.orders)) {
                    fetchedOrders = data.orders;
                }
                setOrdersList(fetchedOrders);
            })
            .catch((error) => {
                console.error("Error fetching all orders:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to load orders. Please try again later.",
                });
            });
        }, []);

    useEffect(() => {
        if (user.isAdmin) {
            fetchAllProducts();
            fetchAllOrders(); // Fetch orders on initial load as well
        }
    }, [user, fetchAllProducts, fetchAllOrders]); // Depend on user and memoized fetch functions

    // Add Product Modal functions
    const openAdd = () => setShowAdd(true);
    const closeAdd = () => {
        setName("");
        setDescription("");
        setPrice(0);
        setImage(""); // <-- Reset imageUrl
        setShowAdd(false);
    };


    // Edit Product Modal functions
    const openEdit = (productId) => {
        setId(productId);
        fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setShowEdit(true);
            })
            .catch(error => {
                console.error("Error fetching product for edit:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to load product details for editing.",
                });
            });
    };

    const closeEdit = () => {
        setName("");
        setDescription("");
        setPrice(0);
        setShowEdit(false);
    };

    // CRUD Operations
    const addProduct = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name,
                description,
                price,
                image // <-- Send imageUrl
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data._id) {
                Swal.fire({
                    icon: "success",
                    title: "Product added!"
                });
                closeAdd();
                fetchAllProducts();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to add product"
                });
            }
        });
    };


    const editProduct = (e, productId) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
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
                    icon: "success",
                    title: "Product Updated!",
                    text: "Product successfully updated.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                closeEdit();
                fetchAllProducts(); // Re-fetch products to update the list
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oh No!",
                    text: data.message || "Something went wrong.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                closeEdit();
            }
        })
        .catch(error => {
            console.error("Error updating product:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update product.",
            });
        });
    };

    const activateProduct = (productId) => {
        fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/activate`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Product activated successfully') {
                Swal.fire({
                    icon: "success",
                    title: "Product Activated!",
                    text: "Product successfully activated.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchAllProducts(); // Re-fetch products
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oh No!",
                    text: data.message || "Something went wrong.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        })
        .catch(error => {
            console.error("Error activating product:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to activate product.",
            });
        });
    };

    const archiveProduct = (productId) => {
        fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/archive`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Product archived successfully') {
                Swal.fire({
                    icon: "success",
                    title: "Product Archived!",
                    text: "Product successfully archived.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchAllProducts(); // Re-fetch products
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oh No!",
                    text: data.message || "Something went wrong.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        })
        .catch(error => {
            console.error("Error archiving product:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to archive product.",
            });
        });
    };
    
    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Rendered product rows
    const productRows = filteredProducts.map(productData => (
        <tr key={productData._id}>
            <td>
                <Link to={`/products/${productData._id}`} className={styles.productLink}>
                    {productData.name}
                </Link>
            </td>
            <td>{productData.description}</td>
            <td>₱{productData.price.toFixed(2)}</td>
            <td>
                {productData.isActive ?
                    <span className="text-success fw-bold">Available</span>
                    :
                    <span className="text-danger fw-bold">Archived</span>
                }
            </td>
            <td>
                <Button
                    variant="info" // Changed color for update button
                    size="sm"
                    className="me-2 mb-1" // Margin-end and margin-bottom for spacing
                    onClick={() => openEdit(productData._id)}
                >
                    <i className="bi bi-pencil-square"></i> Update
                </Button>
                {productData.isActive ?
                    <Button
                        variant="warning" // Changed color for disable
                        size="sm"
                        className="mb-1"
                        onClick={() => archiveProduct(productData._id)}
                    >
                        <i className="bi bi-archive"></i> Archive
                    </Button>
                    :
                    <Button
                        variant="success"
                        size="sm"
                        className="mb-1"
                        onClick={() => activateProduct(productData._id)}
                    >
                        <i className="bi bi-box-arrow-up"></i> Activate
                    </Button>
                }
            </td>
        </tr>
    ));

    // Rendered order cards
    const orderCards = ordersList.length > 0 ? (
        ordersList.map((order, index) => (
            <Card key={order._id || index} className="mb-3 shadow-sm"> {/* Added shadow */}
               <Accordion.Header eventKey={order._id || index} className="bg-primary text-white"> {/* Changed header color */}
                    <h5 className="mb-0">
                        Order ID: {order._id} - User: <span className="text-warning">{order.userId}</span>
                    </h5>
                </Accordion.Header>
                <Accordion.Body eventKey={order._id || index}>
                    <Card.Body>
                        <h6 className="text-muted">Purchased on {moment(order.orderedOn).format("MMMM DD, YYYY hh:mm A")}:</h6>
                        {order.productsOrdered.length > 0 ? (
                            <Table striped bordered hover size="sm" className="mt-3">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.productsOrdered.map((product, pIndex) => (
                                        <tr key={product._id || pIndex}>
                                            <td>{product.productName}</td>
                                            <td>{product.quantity}</td>
                                            <td>₱{(product.quantity * product.price).toFixed(2)}</td> {/* Calculate subtotal */}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-muted">No products found for this order.</p>
                        )}
                        <h4 className="mt-3 text-end">Total: <span className="text-primary fw-bold">₱{order.totalPrice.toFixed(2)}</span></h4>
                    </Card.Body>
                </Accordion.Body>
            </Card>
        ))
    ) : (
        <p className="text-center text-muted fs-5 mt-5">No orders available yet.</p>
    );

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4 text-primary">Admin Dashboard</h1> {/* Larger, branded title */}
            <p className="text-center text-muted mb-5">Manage products and view customer orders.</p>

            {/* Dashboard Controls */}
            <Row className="mb-4">
                <Col md={8} className="d-flex justify-content-start align-items-center mb-3 mb-md-0 flex-wrap"> {/* Added flex-wrap for responsiveness */}
                    <Button
                        variant="primary"
                        className="me-3 mb-2" // Added mb-2 for vertical spacing on smaller screens
                        onClick={openAdd}
                    >
                        <i className="bi bi-plus-circle me-1"></i> Add New Product
                    </Button>
                    <Button
                        variant={activeTab === 'products' ? 'dark' : 'outline-dark'}
                        className="me-2 mb-2" // Added mb-2
                        onClick={() => setActiveTab('products')}
                    >
                        <i className="bi bi-grid-3x3-gap-fill me-1"></i> Product Management
                    </Button>
                    <Button
                        variant={activeTab === 'orders' ? 'dark' : 'outline-dark'}
                        className="mb-2" // Added mb-2
                        onClick={() => setActiveTab('orders')}
                    >
                        <i className="bi bi-card-list me-1"></i> Customer Orders
                    </Button>
                    {/* NEW: Link to Archived Products */}
                    <Link to="/admin/archive" className="btn btn-secondary ms-3 mb-2"> {/* Added ms-3 for margin-left and mb-2 */}
                        <i className="bi bi-box-arrow-in-down-right me-1"></i> View Archived
                    </Link>
                </Col>
                <Col md={4}>
                    {activeTab === 'products' && (
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline-secondary">
                                <i className="bi bi-search"></i>
                            </Button>
                        </InputGroup>
                    )}
                </Col>
            </Row>

            {/* Main Content Area - Conditional Rendering */}
            <Card className="shadow-lg p-4 bg-white rounded-3"> {/* Added shadow and rounded corners */}
                {activeTab === 'products' ? (
                    <>
                        <h3 className="mb-4 text-secondary">Product List</h3>
                        {products.length > 0 ? (
                            <Table striped bordered hover responsive className={styles.adminTable}>
                                <thead className="bg-primary text-white"> {/* Changed header color */}
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Availability</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productRows}
                                </tbody>
                            </Table>
                        ) : (
                             <p className="text-center text-muted fs-5 mt-5">No products available yet. Add one!</p>
                        )}
                    </>
                ) : (
                    <>
                       <h3 className="mb-4 text-secondary">All Customer Orders</h3>
                            <Accordion defaultActiveKey="0">
                            {ordersList.length > 0 ? (
                                ordersList.map((order, index) => (
                                <Accordion.Item eventKey={order._id || index} key={order._id || index} className="mb-3 shadow-sm">
                                    <Accordion.Header>
                                    <h5 className="mb-0">
                                        Order ID: {order._id} - User: <span className="text-warning">{order.userId}</span>
                                    </h5>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                    <h6 className="text-muted">
                                        Purchased on {moment(order.orderedOn).format("MMMM DD, YYYY hh:mm A")}:
                                    </h6>
                                    {order.productsOrdered.length > 0 ? (
                                        <Table striped bordered hover size="sm" className="mt-3">
                                        <thead className="bg-light">
                                            <tr>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.productsOrdered.map((product, pIndex) => (
                                            <tr key={product._id || pIndex}>
                                                <td>{product.productName}</td>
                                                <td>{product.quantity}</td>
                                                <td>₱{(product.quantity * product.price).toFixed(2)}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                        </Table>
                                    ) : (
                                        <p className="text-muted">No products found for this order.</p>
                                    )}
                                    <h4 className="mt-3 text-end">
                                        Total: <span className="text-primary fw-bold">₱{order.totalPrice.toFixed(2)}</span>
                                    </h4>
                                    </Accordion.Body>
                                </Accordion.Item>
                                ))
                            ) : (
                                <p className="text-center text-muted fs-5 mt-5">No orders available yet.</p>
                            )}
                            </Accordion>
                    </>
                )}
            </Card>


            {/* Add New Product Modal */}
            <Modal show={showAdd} onHide={closeAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addProduct}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={price}
                                onChange={e => setPrice(Number(e.target.value))}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={image}
                                onChange={e => setImage(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" block>
                            Add Product
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Product Modal */}
            <Modal show={showEdit} onHide={closeEdit} centered>
                <Form onSubmit={e => editProduct(e, id)}>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="editProductName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editProductDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter product description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editProductPrice">
                            <Form.Label>Price</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>₱</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter product price"
                                    value={price}
                                    onChange={e => setPrice(parseFloat(e.target.value))}
                                    min="0"
                                    required
                                />
                            </InputGroup>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEdit}>
                            Cancel
                        </Button>
                        <Button variant="success" type="submit"> {/* Changed to success for update action */}
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}