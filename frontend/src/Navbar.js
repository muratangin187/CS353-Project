import {Button, Nav, Navbar, InputGroup, FormControl} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./services/AuthContext";
import axios from "axios";

function CustomNavbar(){
    const {getCurrentUser} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const location = useLocation()


    useEffect(async ()=>{
        let userResponse = await getCurrentUser;
        setUser(userResponse?.data);
        if(userResponse.data && userResponse.data.id){
            let response = await axios({
                url: "/api/user/get-notifications/"+userResponse?.data.id,
                method: "GET"
            });
            if(response.status == 200){
                console.log("NOTIFICATIONS: " + JSON.stringify(response.data));
                setNotifications(response.data);
            }
        }
    }, [location.pathname]);

    return (
        <Navbar bg="light" variant="light">
            <Navbar.Brand href="/">Ucollege</Navbar.Brand>
            <Nav className="m-auto">
                {user ? (user.isAdmin ? null : <Nav.Link href="/my-courses">My Courses</Nav.Link>) : null}
                <Nav.Link href="/about">About Us</Nav.Link>
            </Nav>
            {user ? (user.isAdmin ? (
                <Link to="/admin"><Button style={{marginRight: 20}} variant="outline-dark">Admin Panel</Button></Link>
            ) : (
                user.isCreator ? (
                <>
                    <Link to="/create-course"><Button className="ml-auto" style={{marginRight: 20}} variant="outline-dark">Create Course</Button></Link>
                    <Link to="/profile"><Button style={{marginRight: 20}} variant="outline-dark">Profile of {user.name}</Button></Link>
                </>
                ) : (
                <>
                    <InputGroup.Text id="basic-addon1">{notifications ? notifications.length : "0"}</InputGroup.Text>
                    <Link to="/my-notifications"><Button className="mr-4" variant="outline-secondary">Notifications</Button></Link>
                <Link to="/profile"><Button style={{marginRight: 20}} variant="outline-dark">Profile of {user.name}</Button></Link>
                    <Nav.Link href="/my-cart">My Cart</Nav.Link>
                    <Nav.Link href="/my-wishlist">My Wishlist</Nav.Link>
                </>
            ))) : (
                <>
                    <Link to="/login"><Button className="ml-auto" style={{marginRight: 20}} variant="outline-dark">Login</Button></Link>
                    <Link to="/register"><Button className="ml-auto" variant="outline-dark">Register</Button></Link>
                </>
            )}
        </Navbar>
    );
}

export default CustomNavbar;
