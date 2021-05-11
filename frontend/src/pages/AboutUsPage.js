import {Container, Row, Col, Image, Card, Button, Spinner} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
// import axios from "axios";
// import {useParams} from "react-router-dom";
import '../style/my_cart.css';
import {FiShoppingCart} from "react-icons/fi"
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";

export default function MyCartPage(){


    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [courseList, setCourseList] = useState(null);

    useEffect(async () => {
        let response = await getCurrentUser;
        setUser(response?.data);
        axios.get('/api/user/cart-courses/' + response?.data.id)
            .then(response => {
                setCourseList(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleByRemove = async (index) => {
        axios.delete('/api/user/remove-cart/' + courseList[index].id.toString(10))
            .then(response => {
                let tmp = [...courseList]
                tmp.splice(index,1)
                setCourseList(tmp)
                index--
            })
            .catch(error => {
                console.log(error);
            });
    }




    if(courseList == null || courseList?.length === 0 ){
        return (<Container className="mt-5">
            <h2>You don't have any Courses</h2>
            <h3>
                You can buy Courses from
                <span className="actions">
        <a className="btn" href="/" >Homepage</a>
    </span>
            </h3>

        </Container>);
    }

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