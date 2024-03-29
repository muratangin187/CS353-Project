import {Button, Card, Col, Container, Form, Image, Jumbotron, Row, Toast} from "react-bootstrap";
import {useState, useRef, useContext} from "react";
import {Link, useHistory} from 'react-router-dom';
import axios from "axios";
import AuthService from "../services/AuthService";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";

export default function LoginPage() {
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const formRef = useRef(null);
    const history = useHistory();


    const handleSubmit = async (event) => {
        setIntent("normal");
        setContent("Processing", "Please wait");
        setShow(true);
        const elements = formRef.current;
        event.preventDefault();

        let response = await AuthService.login(elements[0].value, elements[1].value);
        setShow(true);

        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
            history.push("/");
        }else{
            setIntent("failure");
            setContent("Login failed", response.data.message);
        }
    }

    return (
        <Container style={{marginTop: 20}}>
            <Card>
                <Card.Header>
                    Login
                </Card.Header>
                <Card.Body>
                <Row>
                    <Col>
                        <div style={{"height": "80px"}}>
                        <h2>New User? <span> <Link to="/register">Register!</Link>
</span></h2>
                        </div>
                        <Form onSubmit={handleSubmit} ref={formRef}>
                            <Form.Group controlId="formGridUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" required/>
                            </Form.Group>

                            <Form.Group controlId="formGridPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required/>
                            </Form.Group>

                            <Form.Row>
                                <Button className="ml-auto mr-2" variant="primary" type="submit">
                                    Sign In
                                </Button>
                            </Form.Row>
                        </Form>
                    </Col>
                    <Col xs={7}>
                        <Image src="login.png" fluid/>
                    </Col>
                </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}
