import {Button, Card, Col, Container, Form, Image, Jumbotron, Row, Toast} from "react-bootstrap";
import React, {useState, useRef, useContext, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom';
import axios from "axios";
import AuthService from "../services/AuthService";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";

export default function ProfilePage() {
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(async ()=>{
        let response = await getCurrentUser;
        setUser(response?.data);
    }, []);

    const logout = async () => {
        AuthService.logout();
        setShow(true);
        setIntent("success");
        setContent("Logout", "You logout successfully.");
        window.location = window.location.origin;
    }

    return (
        <Container style={{marginTop: 20}}>
            <Card style={{width:"50vw"}}>
                <Card.Body>
                    <Row className="justify-content-md-center mt-5 align-items-center">
                        Profile of {user?.name}
                        <Image
                            className="ml-5"
                            roundedCircle
                            width="200"
                            height="200"
                            style={{float:"right"}}
                            src="https://www.donanimhaber.com/cache-v2/?t=20210507225737&width=-1&text=0&path=https://www.donanimhaber.com/images/images/haber/133189/340x191motosiklet-oyunu-bike-baron-2-ios-icin-on-siparise-acildi.jpg"
                        />
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/my-wishlist");
                        }}>
                            My Wishlist
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/my-cart");
                        }}>
                            My Cart
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/my-balance");
                        }}>
                            Balance
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/change-profile");
                        }}>
                            Change Profile Photo
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/my-refunds");
                        }}>
                            Status of Refunds
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="danger" type="submit" onClick={logout} style={{width:"35vw"}}>
                            Log out
                        </Button>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}
