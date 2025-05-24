import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

// Import icons (keep these if you use them elsewhere, otherwise you can remove SiShopify)
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaRegistered, FaTh, FaChartBar, FaStore } from 'react-icons/fa';
// REMOVED: import { SiShopify } from 'react-icons/si'; // No longer needed for the brand icon

// Import your custom CSS module
import styles from './css/AppNavbar.module.css';

import UserContext from '../UserContext';

// Import the image if it's in the src folder (e.g., if you place it in src/assets/)
// import UALogo from '../assets/images/ua-shop-logo.png'; // Example if your image is in src/assets/images/

export default function AppNavBar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" className={`${styles.navbar} py-3 shadow-lg`}>
            {/* Brand/Logo - MODIFIED HERE */}
            <Link className={`${styles.navbarbrand} ms-3`} to="/">
                <img
                    src="/images/ualogo.png" // ✅ Correct usage for public images
                    alt="The UA Shop Logo"
                    className={styles.brandImage}
                />
                UA Shop
            </Link>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {user.isAdmin ? (
                        <NavLink
                            as={Link}
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                            to="/admin-dashboard"
                        >
                            <FaChartBar className="me-2" /> Admin Dashboard
                        </NavLink>
                    ) : (
                        <NavLink
                            as={Link}
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                            to="/products"
                        >
                            <FaStore className="me-2" /> Products
                        </NavLink>
                    )}
                </Nav>

                <Nav className="ms-auto me-3">
                    {user.id !== null ? (
                        user.isAdmin ? (
                            <NavLink
                                as={Link}
                                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                to="/logout"
                            >
                                <FaSignOutAlt className="me-2" /> Logout
                            </NavLink>
                        ) : (
                            <React.Fragment>
                                <NavLink
                                    as={Link}
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                    to="/cart"
                                >
                                    <FaShoppingCart className="me-2" /> Cart
                                </NavLink>
                                <NavLink
                                    as={Link}
                                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                                    to="/orders"
                                >
                                    <FaTh className="me-2" /> Orders
                                </NavLink>

                                <NavDropdown title={<span><FaUserCircle className="me-2" /> Profile</span>} id="profile-nav-dropdown" className={styles.navLink}>
                                    <NavDropdown.Item as={Link} to="/profile" className={styles.dropdownItem}>
                                        My Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/logout" className={styles.dropdownItem}>
                                        <FaSignOutAlt className="me-2" /> Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </React.Fragment>
                        )
                    ) : (
                        <React.Fragment>
                            <Button
                                as={Link}
                                className={styles.navButton}
                                to="/login"
                            >
                                <FaSignInAlt className="me-2" /> Log In
                            </Button>
                            <Button
                                as={Link}
                                className={styles.navButton}
                                to="/register"
                            >
                                <FaRegistered className="me-2" /> Register
                            </Button>
                        </React.Fragment>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}