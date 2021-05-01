import {Button, Card, Col, Container, Form, Jumbotron, Toast} from "react-bootstrap";
import {useState} from "react";

export default function RegisterPage() {
    const [result, setResult] = useState(null);
    const [toastStyle, setToastStyle] = useState({});

    const handleSubmit = async (event) => {
        setToastStyle({});
        setResult({status: 0, message: "Please wait"});

        const form = event.currentTarget;
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
            <Jumbotron>
                <h1>Sign up</h1>
                <Toast show={result!=null} onClose={()=>setResult(null)} className="fixed-bottom ml-auto mr-5 mb-5">
                    <Toast.Header style={toastStyle}>
                        <strong className="mr-auto">Processing...</strong>
                        <small>time: {new Date().toLocaleTimeString("tr")}</small>
                    </Toast.Header>
                    <Toast.Body>{result?.message}</Toast.Body>
                </Toast>
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
                        <Card style={{width: '18rem', marginBottom: 20}}>
                            <Card.Img variant="top" src="logo192.png"/>
                            <Card.Body className="m-auto">
                                <Button variant="secondary">Change photo</Button>
                            </Card.Body>
                        </Card>
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
            </Jumbotron>
        </Container>
    );
}