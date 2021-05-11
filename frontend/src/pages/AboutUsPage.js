import {Container, Row, Col, Image, Card, Button, Spinner} from "react-bootstrap";

import '../style/my_cart.css';


export default function AboutUsPage(){


    return (
        <div id="my_cart_div">
            <Card id="my_cart_card" style={{margin: 100}}>
                <Card.Body>
                    <Container id="my_cart_page" fluid>
                        <Row id="my_cart_title" style={{marginBottom: 50}}>
                            <Col style={{display: "flex"}}>
                                <h1>Who Are We?</h1>
                            </Col>
                        </Row>
                    </Container>
                                <>
                                    <Row className="list_row" style={{margin: 8}}>
                                        <Col className="list_col_f" md={4} style={{display: "flex", flexDirection: "row"}}>
                                            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
                                                <h3>Murat ANGIN</h3>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr/>
                                </>

                    <>
                        <Row className="list_row" style={{margin: 8}}>
                            <Col className="list_col_f" md={4} style={{display: "flex", flexDirection: "row"}}>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
                                    <h3>Osman Batur INCE</h3>
                                </div>
                            </Col>
                        </Row>
                        <hr/>
                    </>

                    <>
                        <Row className="list_row" style={{margin: 8}}>
                            <Col className="list_col_f" md={4} style={{display: "flex", flexDirection: "row"}}>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
                                    <h3>Umit Yigit BASARAN</h3>
                                </div>
                            </Col>
                        </Row>
                        <hr/>
                    </>

                    <>
                        <Row className="list_row" style={{margin: 8}}>
                            <Col className="list_col_f" md={4} style={{display: "flex", flexDirection: "row"}}>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
                                    <h3>Muhammed Emre YILDIZ</h3>
                                </div>
                            </Col>
                        </Row>
                        <hr/>
                    </>
                </Card.Body>
            </Card>
        </div>
    );

}