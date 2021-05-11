import {Link, useHistory} from "react-router-dom";
import {Button, Card, CardDeck, Col, Container, Form, Pagination, Row} from "react-bootstrap";
import {Categories} from "../constants/constants";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";

function CourseCard(course){
    let link = "/course/" + course.id;
    return (
        <Link to={link} key={course.id} style={{ textDecoration: 'none', color: "black" }}>
            <Card className="m-3" style={{ width: '18rem'}}>
                <Card.Img variant="top" src={course.thumbnail}/>
                <Card.Body>
                    <Card.Subtitle className="mb-2" style={{fontSize:12}}>{course.category} | {course.averageRating}/5 | -5% Discount | {course.price}TL</Card.Subtitle> {/*TODO change discount to dynamic*/}
                    <Card.Title>{course.title}</Card.Title>
                    <Card.Text>
                        {course.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    );
}

export default function Homepage(){

    const [order, setOrder] = useState("Price");
    const [orderDirection, setOrderDirection] = useState("ASC");
    const [search, setSearch] = useState("");

    const [courses, setCourses] = useState([]);
    const [pageCount, setPageCount] = useState(5);



    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [courseList, setCourseList] = useState(null);

    useEffect(async () => {
        let response = await getCurrentUser;
        setUser(response?.data);
        axios.get('/api/user/bought-courses/' + response?.data.id)
            .then(response => {
                setCourseList(response.data);
                console.log(response);
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);




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
        <Container className="mt-3 ml-5 mr-5" fluid>
            <Row className="justify-content-md-center mt-2">
                <h1>Your Courses</h1>
            </Row>

            <Row className="mt-5">
                <Col md="auto">
                    <Form>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Search</Card.Title>
                                <Card.Text>
                                    <Form.Group>
                                        <Form.Control type="text" placeholder="Search text" onChange={e=>{
                                            setSearch(e.target.value);
                                        }}/>
                                    </Form.Group>
                                </Card.Text>
                            </Card.Body>
                        </Card>

                    </Form>
                </Col>
                <Col>
                    <Row>
                        <CardDeck>
                            {courseList && courseList.map(item=>(CourseCard(item)))}
                        </CardDeck>
                    </Row>

                </Col>
            </Row>
        </Container>
    );
}
