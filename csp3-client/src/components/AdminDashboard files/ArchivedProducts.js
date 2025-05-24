import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    Container,
    Table,
    Button,
    Modal,
    Form,
    InputGroup,
    FormControl,
    Row, Col,
    Card
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../../UserContext'; // Assuming UserContext is in your root

// Import custom CSS module for styling (you can reuse AdminView.module.css or create a new one)
import styles from '../css/admindashboard/AdminView.module.css'; // Adjust path as needed

export default function ArchivedProducts() {
    const { user } = useContext(UserContext);

    const [archivedProducts, setArchivedProducts] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [showEdit, setShowEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchArchivedProducts = useCallback(() => {
        fetch(`${process.env.REACT_APP_API_URL}/products/archived`, { // NEW API ENDPOINT for archived products
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setArchivedProducts(data);
            } else {
                console.error("Expected an array of archived products, but got:", data);
                setArchivedProducts([]);
            }
        })
        .catch(error => {
            console.error("Error fetching archived products:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to load archived products. Please try again later.",
            });
        });
    }, []);

    useEffect(() => {
        if (user.isAdmin) { // Only fetch if admin
            fetchArchivedProducts();
        } else {
             // Redirect or show unauthorized message if not admin
             Swal.fire({
                icon: "error",
                title: "Unauthorized Access",
                text: "You do not have administrative access to view this page.",
            });
            // Optional: Redirect to home or another page
            // history.push('/'); // You would need useHistory from react-router-dom
        }
    }, [user, fetchArchivedProducts]);

    // Open Edit Modal function (similar to AdminView)
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

    // Edit Product function (similar to AdminView)
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
                fetchArchivedProducts(); // Re-fetch archived products to update the list
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

    // Activate Product function (similar to AdminView)
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
                fetchArchivedProducts(); // Re-fetch archived products
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

    // Filter archived products based on search term
    const filteredArchivedProducts = archivedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const productRows = filteredArchivedProducts.map(productData => (
        <tr key={productData._id}>
            <td>
                <Link to={`/products/${productData._id}`} className={styles.productLink}>
                    {productData.name}
                </Link>
            </td>
            <td>{productData.description}</td>
            <td>₱{productData.price.toFixed(2)}</td>
            <td>
                <span className="text-danger fw-bold">Archived</span>
            </td>
            <td>
                <Button
                    variant="info"
                    size="sm"
                    className="me-2 mb-1"
                    onClick={() => openEdit(productData._id)}
                >
                    <i className="bi bi-pencil-square"></i> Update
                </Button>
                <Button
                    variant="success"
                    size="sm"
                    className="mb-1"
                    onClick={() => activateProduct(productData._id)}
                >
                    <i className="bi bi-box-arrow-up"></i> Activate
                </Button>
            </td>
        </tr>
    ));

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4 text-primary">Archived Products</h1>
            <p className="text-center text-muted mb-5">
                View and manage products that have been archived.
            </p>

            <Row className="mb-4 justify-content-between align-items-center">
                <Col md={6}>
                    <InputGroup>
                        <FormControl
                            placeholder="Search archived products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary">
                            <i className="bi bi-search"></i>
                        </Button>
                    </InputGroup>
                </Col>
                <Col md={6} className="d-flex justify-content-end mt-3 mt-md-0">
                    <Link to="/admin-dashboard" className="btn btn-dark"> {/* Link back to Admin Dashboard */}
                        <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
                    </Link>
                </Col>
            </Row>

            <Card className="shadow-lg p-4 bg-white rounded-3">
                <h3 className="mb-4 text-secondary">Archived Product List</h3>
                {archivedProducts.length > 0 ? (
                    <Table striped bordered hover responsive className={styles.adminTable}>
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productRows}
                        </tbody>
                    </Table>
                ) : (
                    <p className="text-center text-muted fs-5 mt-5">No archived products found.</p>
                )}
            </Card>

            {/* Edit Product Modal (reused from AdminView) */}
            <Modal show={showEdit} onHide={closeEdit} centered>
                <Form onSubmit={e => editProduct(e, id)}>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title>Edit Archived Product</Modal.Title>
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
                        <Button variant="success" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}