import {Container, Row, Col, Image, Card, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
// import axios from "axios";
// import {useParams} from "react-router-dom";
import '../style/my_cart.css';
import {FiShoppingCart} from "react-icons/fi"

export default function MyWishlistPage(){
    // TODO after implementing server side delete tmp_course_list
    const tmp_course_list = [
        {
            ID: 1,
            title: "title - 1",
            price: 100,
            thumbnail: "thumbnail.jpg",
            creatorName: "creator - 1"
        },
        {
            ID: 2,
            title: "title - 2",
            price: 200,
            thumbnail: "thumbnail.jpg",
            creatorName: "creator - 2"
        },
        {
            ID: 3,
            title: "title - 3",
            price: 300,
            thumbnail: "thumbnail.jpg",
            creatorName: "creator - 3"
        },
        {
            ID: 4,
            title: "title - 4",
            price: 400,
            thumbnail: "thumbnail.jpg",
            creatorName: "creator - 4"
        }
    ];

    const [courseList, setCourseList] = useState(tmp_course_list);

    return (
        <div id="my_cart_div">
            <Card id="my_cart_card" style={{margin: 100}}>
                <Card.Body>
                    <Container id="my_cart_page" fluid>
                        <Row id="my_cart_title" style={{marginBottom: 50}}>
                            <Col style={{display: "flex"}}>
                                <FiShoppingCart id="shopping_icon"/>
                                <h2>Your Wishlist</h2>
                            </Col>
                        </Row>
                        {
                            courseList.map((course) => {
                                return (
                                    <>
                                        <Row className="list_row" style={{margin: 8}}>
                                            <Col className="list_col_f" md={4} style={{display: "flex", flexDirection: "row"}}>
                                                <Image src={course.thumbnail} style={{width: 80, marginRight: 10}}/>
                                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
                                                    <p>{course.title}</p>
                                                    <p>{course.creatorName}</p>
                                                </div>
                                            </Col>
                                            <Col className="list_col_s" md={{span: 4, offset: 4}}>


                                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
                                                    <p><strong>Current Price</strong></p>
                                                    <p style={{textAlign: "center"}}>{course.price} TL</p>
                                                </div>

                                                <div style={{display: "flex", alignItems: "center"}}>
                                                    <Button variant="secondary" onClick={() => {}}>Add Card</Button>
                                                    {/*  TODO onclick add card  */}
                                                </div>

                                                <div style={{display: "flex", alignItems: "center"}}>
                                                    <Button variant="danger" onClick={() => {}}>Remove</Button>
                                                    {/*  TODO onclick remove  */}
                                                </div>

                                            </Col>
                                        </Row>
                                        <hr/>
                                    </>
                                );
                            })
                        }
                        <Row>
                            <Col md={{span: 2, offset: 10}} style={{display: "flex", justifyContent: "center"}}>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <p><strong><u>+Total Price</u></strong></p>
                                    <p style={{textAlign: "center"}}>
                                        {
                                            courseList.map((course) => course.price)
                                                .reduce((acc, curr) => acc + curr)
                                        } TL
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{span: 6, offset: 3}} style={{display: "flex", flexDirection: "column"}}>
                                <Button variant="outline-dark" style={{margin: 8}}>Buy courses in my Wishlist</Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </div>
    );

}