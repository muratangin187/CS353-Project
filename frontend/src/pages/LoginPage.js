import {Button, Card, Col, Container, Form, Image, Jumbotron, Row, Toast} from "react-bootstrap";
import {useState} from "react";
import {Link} from 'react-router-dom';

export default function LoginPage() {
    const [result, setResult] = useState(null);
    const [signedIn, setSignedIn] = useState(false);
    const [toastStyle, setToastStyle] = useState({});

    const handleSubmit = async (event) => {
        setToastStyle({});
        setResult({status: 0, message: "Please wait"});

        const form = event.currentTarget;
        event.preventDefault();

        let response = await fetch("/api/user/login", {
            method: "GET",
            body: {username: "Murat"}
        });
        let body = await response.json();

        setResult({status: response.status, message: body.api});
        setToastStyle({backgroundColor: response.status == 200 ? "rgb(200,255,200)" : "rgb(255,200,200)"});
    }

    const handleCheckBoxChange = (event) => {
        // console.log(signedIn);
        setSignedIn(!signedIn);
    }

    return (
        <Container style={{marginTop: 20}}>
            <Card>
                <Card.Header>
                    Login
                </Card.Header>
                <Toast show={result!=null} onClose={()=>setResult(null)} className="fixed-bottom ml-auto mr-5 mb-5">
                    <Toast.Header style={toastStyle}>
                        <strong className="mr-auto">Processing...</strong>
                        <small>time: {new Date().toLocaleTimeString("tr")}</small>
                    </Toast.Header>
                    <Toast.Body>{result?.message}</Toast.Body>
                </Toast>
                <Card.Body>
                <Row>
                    <Col>
                        <div style={{"height": "80px"}}>
                        <h2>New User? <span> <Link to="/register">Register!</Link>
</span></h2>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formGridUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" required/>
                            </Form.Group>

                            <Form.Group controlId="formGridPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required/>
                            </Form.Group>
                            
                            <Form.Group controlId="formGridKeepSignedIn">
                                <Form.Check type="checkbox" onChange={handleCheckBoxChange} label="Keep me signed in" />
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