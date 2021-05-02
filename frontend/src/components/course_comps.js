import {Col, Container, ListGroup, ListGroupItem, Button, Row} from "react-bootstrap";
import React, { Component } from 'react';


class LecturesComp extends React.Component {
    constructor(props) {
        super(props);
        this.isWatched = false;
    }
    render() {
      return (
          <Container className="ml-auto">
            <ListGroup>
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
          <Container className="ml-auto">
            <ListGroup>
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

export {LecturesComp, QuizzesComp}