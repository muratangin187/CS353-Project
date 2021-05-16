import {Button, Card, Col, Container, Form, Toast, Dropdown, DropdownButton} from "react-bootstrap";
import {useState, useRef, useContext, useEffect} from "react";
import {Categories} from "../constants/constants";
import axios from 'axios';

import {useHistory} from 'react-router-dom';
import {AuthContext} from "../services/AuthContext";

export default function CreateCoursePage() {
    const [result, setResult] = useState(null);
    const [toastStyle, setToastStyle] = useState({});
    const [curCategory, setCurCategory] = useState(Categories[0]);
    const formRef = useRef(null);
    let history = useHistory();
    const {getCurrentUser} = useContext(AuthContext);
    const [user, setUser] = useState(null);

    useEffect(async ()=>{
        let response = await getCurrentUser;
        setUser(response?.data);
    }, []);

    const handleSubmit = async (event) => {
        setToastStyle({});
        setResult({status: 0, message: "Please wait"});
        const elements = formRef.current;

        event.preventDefault();
        console.log(user);
        let response = await axios({
            url:"/api/course/create",
            method: "POST",
            data: {
                title: elements[0].value,
                price: elements[1].value,
                description: elements[2].value,
                thumbnail: elements[3].value,
                category: curCategory,
                creator_id: user.id
            }
        });
        setResult({status: response.status, message: response.data.message});
        setToastStyle({backgroundColor: response.status == 200 ? "rgb(200,255,200)" : "rgb(255,200,200)"});
        setTimeout(()=>{
            history.push("/my-courses");
        },1000);
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
                            <div style={{textAlign: "center"}}>Category</div>
                            <div style={{textAlign: "center"}} className="mt-1">
                            <DropdownButton id="dropdown-basic-button" title={curCategory} onSelect={(event) => {setCurCategory(event)}}>
                                <>
                                    {Categories.map(
                                        (category) => (
                                            <Dropdown.Item eventKey={category}>{category}</Dropdown.Item>
                                        )
                                    )}
                                </>
                            </DropdownButton>
                            </div>

                            <div className="mt-4" style={{textAlign: "center"}}>
                                <Button variant="success" type="submit" >
                                    Create Course
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Card.Body>
                <Card.Footer/>
            </Card>
        </Container>
    );
}
