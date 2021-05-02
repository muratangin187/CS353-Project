import {Button, Card, Col, Container, Form, Image, Jumbotron, Row, Toast} from "react-bootstrap";
import {useState} from "react";

export default function RegisterPage() {
    const [result, setResult] = useState(null);
    const [toastStyle, setToastStyle] = useState({});


    const handleSubmit = async (event) => {
        setToastStyle({});
        setResult({status: 0, message: "Please wait"});

        const form = event.currentTarget;
        console.log(form);
        
        event.preventDefault();
        let response = await fetch("/api/user/login", {
            method: "POST",
            body: {username: "Murat"}
        });
        let body = await response.json();

        setResult({status: response.status, message: body.api});
        setToastStyle({backgroundColor: response.status == 200 ? "rgb(200,255,200)" : "rgb(255,200,200)"});
    }

    return (
        <Container style={{marginTop: 20}}>
            <Card>
                <Card.Header>Sign up</Card.Header>
                <Toast show={result!=null} onClose={()=>setResult(null)} className="fixed-bottom ml-auto mr-5 mb-5">
                    <Toast.Header style={toastStyle}>
                        <strong className="mr-auto">Processing...</strong>
                        <small>time: {new Date().toLocaleTimeString("tr")}</small>
                    </Toast.Header>
                    <Toast.Body>{result?.message}</Toast.Body>
                </Toast>
                <Card.Body>
                <Row>
                    <Col >
                        <Form onSubmit={handleSubmit}>
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
                                <Button className="ml-auto mr-2" variant="primary" type="submit">
                                    Register as creator
                                </Button>
                                <Button className="mr-auto ml-2" variant="success" type="submit">
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