import {Container, Row, Col, Form, Card, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
// import axios from "axios";
// import {useParams} from "react-router-dom";
import {FiShoppingCart} from "react-icons/fi"

export default function AnswerQuestionPage(){
    // TODO after implementing server side delete tmp_course_list
   const tmp_question = "Who am I?"

    const [question, setQuestion] = useState(tmp_question);

    return (
        <div id="my_cart_div">
            <Card id="my_cart_card" style={{margin: 100}}>
                <Card.Body>
                    <Container id="my_cart_page" fluid>
                        <Row id="my_cart_title" style={{marginBottom: 50}}>
                            <h2>{question}</h2>
                        </Row>
                        <Form.Group controlId="Answer">
                            <Form.Control as="textarea" rows={10} placeholder = "Answer"/>
                        </Form.Group>
                        <Row>
                            <Col md={{span: 6, offset: 3}} style={{display: "flex", flexDirection: "column"}}>
                                <Button variant="outline-dark" style={{margin: 8}}>Answer</Button>
                                <Button variant="outline-dark" style={{margin: 8}}>Back to homepage</Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </div>
    );

}