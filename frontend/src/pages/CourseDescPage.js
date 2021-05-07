import {
    Row,
    Col,
    Container,
    ListGroup,
    Button,
    Modal,
    Image,
    Spinner, Card
} from "react-bootstrap";
import React, {useState, useEffect, useContext} from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';

import {
    ListRatingsComp
} from "../components/course_comps";
import {CgWebsite} from "react-icons/cg";
import {AiFillLinkedin, AiFillYoutube} from "react-icons/ai";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";

export default function CourseDescPage() {
    const params = useParams();
    const context = useContext(NotificationContext);
    const [setShowToast, setContent, setIntent] = [context.setShow, context.setContent, context.setIntent];
    const {getCurrentUser} = useContext(AuthContext);
    const [courseData, setCourseData] = useState(null);
    const [courseCreator, setCourseCreator] = useState({}); // course creator JSON object
    const [show, setShow] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        if(userData == null){
            setShowToast(true);
            setIntent("failure");
            setContent("Transaction cannot be processed", "Please login or register");
            return;
        } else if( userData.balance < courseData.price){
            setShowToast(true);
            setIntent("failure");
            setContent("Transaction cannot be processed", "Insufficient funds");
            return;
        }
        console.log(`User balance: ${userData.balance}, Course price: ${courseData.price}`);
        setShow(true);
    };

    useEffect(async () => {
        let userResponse = await getCurrentUser;
        setUserData(userResponse?.data);

        let response = await axios({
            url:"/api/course/retrieve/" + params.cid,
            method: "GET",
        });
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
            <Spinner cselassName="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    const handleBuySubmit = async (event) => {
        let response = await axios({
            url: "/api/course/buyCourse",
            method: "POST",
            data: {
                uid: userData.id,
                cid: courseData.id
            }
        });

        setShowToast(true);
        if(response.status == 200){
            let response2 = await axios({
                url: "/api/user/change-balance",
                method: "POST",
                data: {
                    userId: userData.id,
                    amount: -courseData.price
                }
            });
            if(response2.status == 200){
                setIntent("success");
                setContent("Success", response.data.message);
                window.location = window.location.origin;
            }else{
                setIntent("failure");
                setContent("Transaction cannot be processed(balance error)", response.data.message);
            }
        } else {
            setIntent("failure");
            setContent("Transaction cannot be processed", response.data.message);
        }
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Buy Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to buy this course?
                </Modal.Body>
                <Modal.Body>
                    <strong>Current Balance:</strong> {userData?.balance ?? 0} TL
                </Modal.Body>
                <Modal.Body>
                    <strong>After Transaction:</strong> {(userData?.balance ?? 0) - courseData.price} TL
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleBuySubmit}>
                        Buy
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row className="mt-3" style={{width: "75vw"}}>
                <Col xs={8}> <ListRatingsComp/> </Col>
                <Col xs={4}>
                    <ListGroup variant="flush" className="mb-5">
                        <ListGroup.Item><Row><Col>Normal Price:</Col><Col>{courseData.price + " TL"}</Col></Row></ListGroup.Item>
                        <ListGroup.Item><Row><Col>Discount Amount:</Col><Col>{"5 TL"}</Col></Row></ListGroup.Item>
                        <ListGroup.Item><Row><Col>Current Price</Col><Col>{(courseData.price - 5) + " TL"}</Col></Row></ListGroup.Item>
                    </ListGroup>
                    <Col>
                    <Button block onClick={handleShow}>Buy Course</Button>
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