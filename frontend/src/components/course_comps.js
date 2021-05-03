import {Col, Card, Container, ListGroup, Image, Button, Row, Badge, Form, ButtonGroup, ToggleButton} from "react-bootstrap";
import React, { Component } from 'react';
import {useState, useRef, useContext, useEffect} from "react";


class LecturesComp extends React.Component {
    constructor(props) {
        super(props);
        this.isWatched = false;
    }
    render() {
      return (
          <Container >
            <ListGroup style={{width:"75vw"}}>
                <ListGroup.Item> 
                    <Row>
                        <Col>1.</Col>
                        <Col xs={8} className="mr-5">
                            <h4>Introduction</h4>
                            <p>What is AWS, how to use it</p>
                        </Col>
                        <Col xs={1} className="ml-5">
                        <Button className="ml-auto mr-2" variant="primary" type="submit">
                                    {this.isWatched ? "Completed" : "Watch"}
                        </Button>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
          </Container>
      );
    }
}

class QuizzesComp extends React.Component {
    constructor(props) {
        super(props);
        this.isCompleted = false;
    }
    render() {
      return (
          <Container className="ml-auto" >
            <ListGroup style={{width:"75vw"}}>
                <ListGroup.Item> 
                    <Row>
                        <Col>1.</Col>
                        <Col xs={8} className="mr-5">
                            <h4>Beginner Quiz</h4>
                            <p>What is AWS, how to use it</p>
                        </Col>
                        <Col xs={1} className="ml-5">
                        <Button className="ml-auto mr-2" variant="primary" type="submit">
                                    {this.isCompleted ? "Score 5/10" : "Take"}
                        </Button>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
          </Container>
      );
    }
}

class QandAComp extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
      return (
          <Container className="ml-auto" >
            <Row>
            <ListGroup style={{width:"75vw"}}>
                <ListGroup.Item> 
                    <Row>
                        <Col>1.</Col>
                        <Col xs={8} className="mr-5">
                            <h4>Beginner Quiz</h4>
                            <p>What is AWS, how to use it</p>
                        </Col>
                        <Col xs={1} className="ml-5">
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item className="ml-5"> 
                    <Row className="ml-5">
                        <Col>1.</Col>
                        <Col xs={8} className="mr-5">
                            <h4>Beginner Quiz</h4>
                            <p>What is AWS, how to use it</p>
                        </Col>
                        <Col xs={1} className="ml-5">
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            </Row>
          </Container>
      );
    }
}

function RatingsComp() {
    const[radioValue, setRadioValue] = useState(5);
    const formRef = useRef(null);
    const radios = [
        {name: "1 star", value: 1},
        {name: "2 stars", value: 2},
        {name: "3 stars", value: 3},
        {name: "4 stars", value: 4},
        {name: "5 stars", value: 5}
    ]

    const handleRatingSubmit = () => {}
    
      return (
          <Container style={{width:"75vw"}}>
          <Row style={{width:"75vw"}}>
          <Col className="mt-3">
            <h4 className="text-left"><strong>Ratings</strong></h4>
            <Row className="mb-5">
            <Image style={{width:"16px", height:"16px"}} src="../star.png" className="mt-1 mr-2 ml-3"/>
            <strong>4.3/5</strong>
            </Row>
            <ListGroup.Item> 
                    <Row>
                        <Col xs={10}>
                            <h4>Mehmet A.</h4>
                            <p>It is a really impressive course, you need to buy it</p>
                        </Col>
                        <Col xs={1} className="mt-3">
                            <Badge className="pl-3" variant="info"> <strong style={{fontSize: "14px"}}>4.8</strong> <Image style={{width:"14px", height:"14px"}} src="../star.png" rounded className="mb-1 mr-1 ml-1"/></Badge>
                        </Col>
                    </Row>
            </ListGroup.Item>
            
            <ListGroup.Item> 
                    <Row>
                        <Col xs={10}>
                            <h4>Mehmet A.</h4>
                            <p>It is a really impressive course, you need to buy it</p>
                        </Col>
                        <Col xs={1} className="mt-3">
                            <Badge className="pl-3" variant="info"> <strong style={{fontSize: "14px"}}>4.8</strong> <Image style={{width:"14px", height:"14px"}} src="../star.png" rounded className="mb-1 mr-1 ml-1"/></Badge>
                        </Col>
                    </Row>
            </ListGroup.Item>
            </Col>
            <Col className="mt-3">
                <h4><strong>Rate the course</strong></h4>
                <Form onSubmit={handleRatingSubmit} ref={formRef}>
                    <ButtonGroup toggle className="mb-3">
                        {radios.map((radio, idx) => (
                            <ToggleButton 
                                key={idx}
                                type="radio"
                                variant="primary"
                                name="radio"
                                value={radio.value}
                                checked={radioValue === radio.value}
                                onChange={(e) => setRadioValue(e.currentTarget.value)}>
                            {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                    <Form.Control as="textarea" rows={5} required/>
                    <Form.Row className="ml-1 mt-3">
                        <div class="text-center" style={{"display": "flex"}}>
                            <Button variant="success" type="submit">
                                Rate
                            </Button>
                        </div>
                    </Form.Row>
                </Form>
            </Col>
          </Row>
          </Container>
      );
}

function AnnouncementsComp() {
    return (
        <Container style={{width:"75vw"}}>
        <Card style={{width:"75vw"}}>
  <Card.Header>Server files updated</Card.Header>
  <Card.Body>
    <blockquote className="blockquote mb-0">
      <p>
        {' '}
        You need to redownload files in Lecture 25{' '}
      </p>
      <footer className="text-muted" style={{fontSize:"14px"}}>
        20 October 2020
      </footer>
    </blockquote>
  </Card.Body>
</Card></Container>
    );
}

export {LecturesComp, QuizzesComp, QandAComp, RatingsComp, AnnouncementsComp}