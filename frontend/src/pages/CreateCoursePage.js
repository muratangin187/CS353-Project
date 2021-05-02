import {Button, Card, Col, Container, Form, Image, Jumbotron, Row, Toast, Dropdown, DropdownButton} from "react-bootstrap";
import {useState, useRef} from "react";
import {Categories} from "../constants/constants";
import {Link} from 'react-router-dom';

export default function CreateCoursePage() {
    const [result, setResult] = useState(null);
    const [toastStyle, setToastStyle] = useState({});
    const [curCategory, setCurCategory] = useState(Categories[0]);
    const formRef = useRef(null);


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
                <Card.Header>Create a Course</Card.Header>
                <Toast show={result!=null} onClose={()=>setResult(null)} className="fixed-bottom ml-auto mr-5 mb-5">
                    <Toast.Header style={toastStyle}>
                        <strong className="mr-auto">Processing...</strong>
                        <small>time: {new Date().toLocaleTimeString("tr")}</small>
                    </Toast.Header>
                    <Toast.Body>{result?.message}</Toast.Body>
                </Toast>
                <Card.Body>
                    <Col >
                        <Form onSubmit={handleSubmit} ref={formRef}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridTitle">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" placeholder="Title" required/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridPrice">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="text" placeholder="Price" required/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="formGridDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={5} required/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formThumbnailLink">
                                    <Form.Label>Thumbnail link</Form.Label>
                                    <Form.Control type="text" placeholder="Enter in http:// form" required/>
                            </Form.Group>
                            <div class="centered-div">Category</div>
                            <div class="centered-div">
                            <DropdownButton className="ml-auto mr-2" id="dropdown-basic-button" title={curCategory} onSelect={(event) => {setCurCategory(event)}}>
                                <>
                                    {Categories.map(
                                        (category) => (
                                            <Dropdown.Item eventKey={category}>{category}</Dropdown.Item>
                                        )
                                    )}
                                </>
                            </DropdownButton>
                            </div>
                            

                            <Form.Row>
                                <div class="text-center" style={{"display": "flex"}}>
                                <Button className="ml-auto mr-2" variant="success" type="submit">
                                    Create Course
                                </Button>
                                </div>
                            </Form.Row>
                        </Form>
                    </Col>
                </Card.Body>
                <Card.Footer></Card.Footer>
            </Card>
        </Container>
    );
}