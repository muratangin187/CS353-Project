import {Container, Row, Col, Form, Card, Button} from "react-bootstrap";

import {useEffect, useState} from "react";
// import axios from "axios";
// import {useParams} from "react-router-dom";
import {FiShoppingCart} from "react-icons/fi"

export default function CreateDiscountPage(){
    // TODO after implementing server side delete tmp_course_list

    return (
        <div id="my_cart_div">
            <Card id="my_cart_card" style={{margin: 100}}>
                <Card.Body>
                    <Container id="my_cart_page" fluid>
                        <Row id="my_cart_title" style={{marginBottom: 50}}>
                            <h2>Create Discount</h2>
                        </Row>
                        <Row style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                            <Form.Group controlId="dos">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control type="date" name="dob" placeholder="Date of Birth" />
                            </Form.Group>

                            <Form.Group controlId="doe" md={{span: 4, offset: 4}}>
                                <Form.Label>End Date</Form.Label>
                                <Form.Control type="date" name="dob" placeholder="Date of Birth" />
                            </Form.Group>
                        </Row>

                        <Row style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                            <Form.Group controlId="percentage">
                                <Form.Control type="text" placeholder="Percentage" />
                            </Form.Group>

                            <Form.Group controlId="CourseID">
                                <Form.Control type="text" placeholder="CourseID" />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Col md={{span: 6, offset: 3}} style={{display: "flex", flexDirection: "column"}}>
                                <Button variant="outline-dark" style={{margin: 8}}>Create Discount</Button>
                                <Button variant="outline-dark" style={{margin: 8}}>Back to homepage</Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </div>
    );

}