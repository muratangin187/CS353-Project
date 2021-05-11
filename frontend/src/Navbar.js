import {Button, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./services/AuthContext";

function CustomNavbar(){
    const {getCurrentUser} = useContext(AuthContext);
    const [user, setUser] = useState(null);

    useEffect(async ()=>{
        let response = await getCurrentUser;
        console.log(response?.data);
        setUser(response?.data);
    }, []);

    return (
        <Navbar bg="light" variant="light">
            <Navbar.Brand href="/">Ucollage</Navbar.Brand>
            <Nav className="m-auto">
                <Nav.Link href="/courses">Courses</Nav.Link>
                <Nav.Link href="/my-courses">My Courses</Nav.Link>
                <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            {user ? (user.isAdmin ? (
                <Link to="/admin"><Button style={{marginRight: 20}} variant="outline-dark">Admin Panel</Button></Link>
            ) : (
                <>
                <Link to="/profile"><Button style={{marginRight: 20}} variant="outline-dark">Profile of {user.name}</Button></Link>
                    <Nav.Link href="/my-cart">My Cart</Nav.Link>
                    <Nav.Link href="/my-wishlist">My Wishlist</Nav.Link>

                </>
            )) : (
                <>
                    <Link to="/login"><Button className="ml-auto" style={{marginRight: 20}} variant="outline-dark">Login</Button></Link>
                    <Link to="/register"><Button className="ml-auto" variant="outline-dark">Register</Button></Link>
                </>
            )}
        </Navbar>
    );
}

export default CustomNavbar;