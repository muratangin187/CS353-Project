import {Button, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./services/AuthContext";

function CustomNavbar(){
    const {getCurrentUser} = useContext(AuthContext);
    const [user, setUser] = useState(null);

    useEffect(async ()=>{
        let response = await getCurrentUser;
        setUser(response?.data);
    }, []);

    const loginOrProfile = async()=>{
        if(user){
            return (
                <Link to="/profile"><Button style={{marginRight: 20}} variant="outline-dark">Profile of {user.name}</Button></Link>
            );
        }else{
            return (
                <>
                    <Link to="/login"><Button className="ml-auto" style={{marginRight: 20}} variant="outline-dark">Login</Button></Link>
                    <Link to="/register"><Button className="ml-auto" variant="outline-dark">Register</Button></Link>
                </>
            );
        }
    }

    return (
        <Navbar bg="light" variant="light">
            <Navbar.Brand href="/">Ucollage</Navbar.Brand>
            <Nav className="m-auto">
                <Nav.Link href="/courses">Courses</Nav.Link>
                <Nav.Link href="/my-courses">My Courses</Nav.Link>
                <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            {user ? (
                <Link to="/profile"><Button style={{marginRight: 20}} variant="outline-dark">Profile of {user.name}</Button></Link>
            ) : (
                <>
                    <Link to="/login"><Button className="ml-auto" style={{marginRight: 20}} variant="outline-dark">Login</Button></Link>
                    <Link to="/register"><Button className="ml-auto" variant="outline-dark">Register</Button></Link>
                </>
            )}
        </Navbar>
    );
}

export default CustomNavbar;