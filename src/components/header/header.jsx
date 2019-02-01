import React from 'react';
import { Link } from 'react-router-dom';

import { Navbar, Nav, NavItem } from 'react-bootstrap';

const Header = () => (
    <header>
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to="/">Invoice App</Link>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav>
                <NavItem componentClass={Link}  href="/" to="/" active={location.pathname === '/'}>Invoices</NavItem>
                <NavItem componentClass={Link}  href="/products" to="/products" active={location.pathname === '/products'}>Products</NavItem>
                <NavItem componentClass={Link}  href="/customers" to="/customers" active={location.pathname === '/customers'}>Customer</NavItem>
            </Nav>
        </Navbar>
    </header>
);

export default Header;