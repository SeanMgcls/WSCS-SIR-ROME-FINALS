import {useState, useEffect} from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function Register(){

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [error1, setError1] = useState(true);
    const [error2, setError2] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [willRedirect, setWillRedirect] = useState(false);

    useEffect(() => {
        if ((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password1, password2]);

    useEffect(() => {
        if (email === '' || password1 === '' || password2 === '') {
            setError1(true);
            setError2(false);
            setIsActive(false);
        } else if ((email !== '' && password1 !== '' && password2 !== '') && (password1 !== password2)) {
            setError1(false);
            setError2(true);
            setIsActive(false);
        } else if((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)) {
            setError1(false);
            setError2(false);
            setIsActive(true);
        }
    }, [email, password1, password2]);

    const registerUser = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                mobileNo: mobileNo,
                password: password1
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Registered Successfully") {
                Swal.fire({
                    title: 'Registration successful!',
                    icon: 'success',
                    text: 'You may now log in.'
                });
                setWillRedirect(true);
            } else {
                Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    text: 'Please check your details and try again.',
                });
                setFirstName("");
                setLastName("");
                setEmail("");
                setMobileNo("");
                setPassword1("");
                setPassword2("");
            }
        })
    }

    return(
        willRedirect === true ?
            <Redirect to={{pathname: '/login', state: { from: 'register'}}}/>
        :
            <Row 
                className="justify-content-center align-items-center"
                style={{
                    minHeight: "100vh",
                    backgroundImage: "url(/images/uashop.png)",// Adjust the path to your image
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <Col 
                    xs={12} md={6}
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ minHeight: "80vh"}}
                >
                    <h2 className="text-center my-4 fw-bold" style={{ fontSize: "2.5rem", color: "#fff" }}>
                        Register
                    </h2>
                    <Card style={{ width: "100%", maxWidth: "600px", borderRadius: "0.5rem" }}>
                        <Form onSubmit={e => registerUser(e)}>
                            <Card.Body>

                                <Form.Group controlId="firstName" className="mt-3 mb-3 px-2">
                                    <Form.Label className='fw-bold'>First Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your First Name"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="lastName" className="mb-3 px-2">
                                    <Form.Label className='fw-bold'>Last Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your Last Name"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="userEmail" className="mt-3 mb-3 px-2">
                                    <Form.Label className='fw-bold'>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="mobileNo" className="mt-3 mb-3 px-2">
                                    <Form.Label className='fw-bold'>Mobile Number:</Form.Label>
                                    <PhoneInput
                                        country={'ph'}
                                        value={mobileNo}
                                        onChange={phone => setMobileNo(phone)}
                                        inputProps={{
                                            name: 'mobile',
                                            required: true,
                                            autoFocus: false
                                        }}
                                        inputStyle={{ width: '100%' }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="password1" className="mt-3 mb-3 px-2">
                                    <Form.Label className='fw-bold'>Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password1}
                                        onChange={e => setPassword1(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="password2" className="mt-3 mb-3 px-2">
                                    <Form.Label className='fw-bold'>Verify Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Verify your password"
                                        value={password2}
                                        onChange={e => setPassword2(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                            </Card.Body>
                            <Card.Footer className = "d-flex flex-column align-items-center">
                                {isActive === true ? 
                                    <Button 
                                        variant="success"
                                        type="submit"
                                        block
                                        style={{borderRadius: "0.5rem"}}
                                    >
                                        Register
                                    </Button>
                                : 
                                    error1 === true || error2 === true ? 
                                        <Button
                                            variant="danger"
                                            type="submit"
                                            disabled
                                            block
                                            style={{borderRadius: "0.5rem"}}
                                        >
                                            Please enter your registration details
                                        </Button>
                                    : 
                                        <Button
                                            variant="danger"
                                            type="submit"
                                            disabled
                                            block
                                        >
                                            Passwords must match
                                        </Button>
                                }
                            </Card.Footer>
                        </Form>
                    </Card>
                    <p className="text-center mt-3" style={{ color: "#fff" }}>
                        Already have an account? <Link to={{pathname: '/login', state: { from: 'register'}}}>Click here</Link> to log in.
                    </p>
                </Col>
            </Row>
    );
}