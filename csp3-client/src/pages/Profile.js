import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Container, Modal, Form } from 'react-bootstrap';
import UserContext from '../UserContext';
import { Redirect, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import ResetPassword from '../components/ResetPassword';

export default function Profile() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [editFields, setEditFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    image: ''
  });
  const history = useHistory();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setDetails(data);
          setEditFields({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            mobileNo: data.mobileNo || '',
            image: data.image || ''
          });
        } else if (data.error === 'User not found') {
          Swal.fire({
            title: 'User not found',
            icon: 'error',
            text: 'Something went wrong. Please contact us for assistance.',
          });
          history.push('/profile');
        } else {
          Swal.fire({
            title: 'Something went wrong',
            icon: 'error',
            text: 'Something went wrong. Please contact us for assistance.',
          });
          history.push('/profile');
        }
      });
  }, [history]);

  // Use uploaded image or fallback avatar
  const avatarUrl =
    editFields.image?.trim() ||
    details.image?.trim() ||
    'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(`${details.firstName || ''} ${details.lastName || ''}`) +
      '&background=0D8ABC&color=fff&size=128';

  // Handle input change in edit modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit edit form
  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/users/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(editFields),
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setDetails(data.user);
          setShowEdit(false);
          Swal.fire({
            icon: "success",
            title: "Profile updated!",
            text: data.message,
            timer: 1200,
            showConfirmButton: false
          });
        } else if (data && data.error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.error,
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update profile.",
        });
      });
  };

  return (
    <>
      {user.id === null ? (
        <Redirect to="/profile" />
      ) : (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Card style={{ maxWidth: '400px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Card.Body className="text-center">
              <div className="mb-4">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="rounded-circle shadow"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #0d6efd' }}
                />
              </div>
              <h2 className="mb-1">{`${details.firstName || ''} ${details.lastName || ''}`}</h2>
              <p className="text-muted mb-2">{details.email}</p>
              <Card.Text>
                <strong>Mobile No:</strong> {details.mobileNo || <span className="text-muted">N/A</span>}
              </Card.Text>
              <Card.Text>
                <strong>User Type:</strong> {user.isAdmin ? 'Admin' : 'Customer'}
              </Card.Text>
              <Button variant="outline-primary" className="mt-2 mb-3" onClick={() => setShowEdit(true)}>
                Edit Profile
              </Button>
              <hr className="my-4" />
              <h5 className="mb-3 text-primary">Reset Password</h5>
              <ResetPassword />
            </Card.Body>
          </Card>

          {/* Edit Profile Modal */}
          <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleEditSubmit}>
              <Modal.Body>
                <div className="mb-4 text-center">
                  <img
                    src={
                      editFields.image?.trim() ||
                      details.image?.trim() ||
                      'https://ui-avatars.com/api/?name=' +
                        encodeURIComponent(`${editFields.firstName || ''} ${editFields.lastName || ''}`) +
                        '&background=0D8ABC&color=fff&size=128'
                    }
                    alt="preview"
                    className="rounded-circle"
                    style={{ width: 90, height: 90, objectFit: 'cover', border: '2px solid #0d6efd' }}
                  />
                  <div className="text-muted small">Preview</div>
                </div>
                <Form.Group className="mb-3" controlId="editImage">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="image"
                    value={editFields.image}
                    onChange={handleEditChange}
                    placeholder="Paste image URL"
                  />
                  <Form.Text muted>
                    (Leave blank for default or use <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer">Gravatar</a> / avatar URL)
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="editFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={editFields.firstName}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="editLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={editFields.lastName}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="editEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editFields.email}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="editMobileNo">
                  <Form.Label>Mobile No</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNo"
                    value={editFields.mobileNo}
                    onChange={handleEditChange}
                    maxLength="11"
                    minLength="11"
                    required
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEdit(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Container>
      )}
    </>
  );
}