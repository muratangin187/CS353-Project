import {Button, Card, Col, Container, Form, Image, Jumbotron, Row, Toast} from "react-bootstrap";
import {useContext, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {NotificationService} from "../services/NotificationService";

export default function RegisterPage() {
    const [type, setType] = useState(false);
    const {setShow, setContent, setIntent} = useContext(NotificationService);
    const formRef = useRef(null);
    let history = useHistory();

    const handleSubmit = async (event) => {
        setIntent("normal");
        setContent("Processing", "Please wait");
        setShow(true);
        const elements = formRef.current;

        event.preventDefault();
        let response = await axios({
            url:"/api/user/register",
            method: "POST",
            data: {
                username:elements[0].value,
                email:elements[1].value,
                name:elements[2].value,
                surname:elements[3].value,
                password:elements[4].value,
                photo:"placeholder.jpg",
                isCreator: type
            }
        });
        setShow(true);
        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
            setTimeout(()=>{
                history.push("/");
            },2000);
        }else{
            setIntent("failure");
            setContent("Login failed", response.data.message);
        }
    }

    return (
        <Container style={{marginTop: 20}}>
            <Card>
                <Card.Header>Sign up</Card.Header>
                <Card.Body>
                <Row>
                    <Col >
                        <Form onSubmit={handleSubmit} ref={formRef}>
                            <Form.Group controlId="formGridUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" required/>
                            </Form.Group>

                            <Form.Group controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" required/>
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" required/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridSurname">
                                    <Form.Label>Surname</Form.Label>
                                    <Form.Control type="text" placeholder="Enter surname" required/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="formGridPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required/>
                            </Form.Group>

                            <Form.Row className="justify-content-md-center">
                                <Image variant="top" src="profile.png" style={{width:150}}/>
                            </Form.Row>

                            <Form.Row className="justify-content-md-center mt-2 mb-2">
                                <Button variant="secondary">Change photo</Button>
                            </Form.Row>

                            <Form.Row>
                                <Button className="ml-auto mr-2" variant="primary" type="submit" onClick={()=>setType(true)}>
                                    Register as creator
                                </Button>
                                <Button className="mr-auto ml-2" variant="success" type="submit" onClick={()=>setType(false)}>
                                    Register as user
                                </Button>
                            </Form.Row>
                        </Form>
                    </Col>
                    <Col xs={7}>
                        <Image src="login.png" fluid/>
                    </Col>
                </Row>
                </Card.Body>
                <Card.Footer></Card.Footer>
            </Card>
        </Container>
    );
}