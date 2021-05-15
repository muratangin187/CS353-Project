import {Container, Row, Col, Form, Card, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
// import axios from "axios";
// import {useParams} from "react-router-dom";

export default function CreateAnnouncementPage2(){
    // TODO after implementing server side delete tmp_course_list


    return (
        <div id="my_cart_div">
            <Card id="my_cart_card" style={{margin: 100}}>
                <Card.Body>
                    <Container id="my_cart_page" fluid>
                        <Row id="my_cart_title" style={{marginBottom: 50}}>
                            <h2>Create Announcement</h2>
                        </Row>
                        <Form.Group controlId="title">
                            <Form.Control type="text" placeholder="Title" />
                        </Form.Group>

                        <Form.Group controlId="Content">
                            <Form.Control as="textarea" rows={10} placeholder = "Content"/>
                        </Form.Group>
                        <Row>
                            <Col md={{span: 6, offset: 3}} style={{display: "flex", flexDirection: "column"}}>
                                <Button variant="outline-dark" style={{margin: 8}}>Create Announcement</Button>
                                <Button variant="outline-dark" style={{margin: 8}}>Back to homepage</Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </div>
    );

}