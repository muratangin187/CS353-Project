import {
    Row,
    Col,
    Container,
    ListGroup,
    Button,
    Image,
    Spinner, Card
} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';

import {
    ListRatingsComp
} from "../components/course_comps";
import {CgWebsite} from "react-icons/cg";
import {AiFillLinkedin, AiFillYoutube} from "react-icons/ai";

export default function CourseDescPage() {
    const params = useParams();
    const [courseData, setCourseData] = useState(null);
    const [courseCreator, setCourseCreator] = useState({}); // course creator JSON object

    useEffect(async () => {
        let response = await axios({
            url:"/api/course/retrieve/" + params.cid,
            method: "GET",
        });
        // console.log(response.status + "-Response:" + JSON.stringify(response.data,null,2));
        setCourseData(response.data);
        axios.get('/api/creator/' + response.data.creator_id)
            .then(result => {
                setCourseCreator(result.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    if(!courseData ||!courseCreator){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    return (
        <Container className="mt-5" style={{width: "75vw"}}>
            <Row className="border-bottom border-primary" style={{width: "75vw"}}>
                <Col>
                    <h5>{courseData.category}</h5>
                    <h1 className="mb-5">{courseData.title}</h1>
                    <p> {courseData.description} </p>
                </Col>
                <Col xs={3}>
                    <Image style={{width:"300px"}} src={courseData.thumbnail}/>
                </Col>
            </Row>
            <Row className="mt-3" style={{width: "75vw"}}>
                <Col xs={8}> <ListRatingsComp/> </Col>
                <Col xs={4}>
                    <ListGroup variant="flush" className="mb-5">
                        <ListGroup.Item><Row><Col>Normal Price:</Col><Col>{courseData.price + " TL"}</Col></Row></ListGroup.Item>
                        <ListGroup.Item><Row><Col>Discount Amount:</Col><Col>{"5 TL"}</Col></Row></ListGroup.Item>
                        <ListGroup.Item><Row><Col>Current Price</Col><Col>{(courseData.price - 5) + " TL"}</Col></Row></ListGroup.Item>
                    </ListGroup>
                    <Col>
                    <Button block>Buy Course</Button>
                        <Button block>Add to Cart</Button>
                        <Button block>Add to Wishlist</Button>
                    </Col>
                    <Card
                        bg="light"
                        text='dark'
                        style={{ width: '18rem' }}
                        className="mb-2 mt-3 ml-4"
                    >
                        <Card.Img variant="top" src={(courseCreator.photo != "placeholder.jpg") ? courseCreator.photo : "profile.png"} className="creator-img" />
                        <Card.Body style={{alignItems: "center"}}>
                            <Card.Title style={{textAlign: "center"}}> {courseCreator.name} {courseCreator.surname} </Card.Title>
                            <Card.Text style={{textAlign: "center"}}>
                                Job Of Creator
                            </Card.Text>
                        </Card.Body>
                        <Card.Body>
                            <div id="links">
                                <Button className="link_item" variant="outline-dark" href={courseCreator.website}>
                                    <CgWebsite />
                                </Button>
                                <Button className="link_item" variant="outline-dark" href={courseCreator.linkedin}>
                                    <AiFillLinkedin />
                                </Button>
                                <Button className="link_item" variant="outline-dark" href={courseCreator.youtube}>
                                    <AiFillYoutube />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}