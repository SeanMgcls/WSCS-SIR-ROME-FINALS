import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaRegistered, FaTh, FaChartBar, FaStore } from 'react-icons/fa';
import styles from './css/AppNavbar.module.css';
import UserContext from '../UserContext';

// SVG data URI for white hamburger lines
const whiteBurger = "url(\"data:image/svg+xml,%3csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke='rgba(255,255,255,1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")";

export default function AppNavBar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" className={`${styles.navbar} py-3 shadow-lg`}>
            <Link className={`${styles.navbarbrand} ms-3`} to="/">
                <img
                    src="/images/ualogo.png"
                    alt="The UA Shop Logo"
                    className={styles.brandImage}
                />
                <span className={styles.shopBrandText}>UA Shop</span>
            </Link>

            {/* Burger menu with white lines using inline style */}
            <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                style={{
                    borderColor: 'white',
                }}
                children={
                    <span
                        className="navbar-toggler-icon"
                        style={{
                            backgroundImage: whiteBurger,
                        }}
                    />
                }
            />

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
                            <>
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

                                <NavDropdown
                                    title={
                                        <span style={{ color: "white" }}>
                                            <FaUserCircle className="me-2" /> Profile
                                        </span>
                                    }
                                    id="profile-nav-dropdown"
                                    style={{ color: "white" }}
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/profile"
                                        style={{ color: "black" }}
                                    >
                                        My Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/logout"
                                        style={{ color: "black" }}
                                    >
                                        <FaSignOutAlt className="me-2" /> Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )
                    ) : (
                        <>
                            <Button as={Link} className={styles.navButton} to="/login">
                                <FaSignInAlt className="me-2" /> Log In
                            </Button>
                            <Button as={Link} className={styles.navButton} to="/register">
                                <FaRegistered className="me-2" /> Register
                            </Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}