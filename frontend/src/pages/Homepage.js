import {Link} from "react-router-dom";
import {Button, Card, CardDeck, Col, Container, Form, Pagination, Row} from "react-bootstrap";
import {Categories} from "../constants/constants";
import React, {useEffect, useState} from "react";
import axios from "axios";

function CourseCard(course){
    let link = "/course-desc/" + course.id;
    return (
        <Link to={link} key={course.id} style={{ textDecoration: 'none', color: "black" }}>
            <Card className="m-3" style={{ width: '18rem'}}>
                <Card.Img variant="top" src={course.thumbnail}/>
                <Card.Body>
                    <Card.Subtitle className="mb-2" style={{fontSize:12}}>{course.category} | {course.averageRating}/5</Card.Subtitle>
                    <Card.Subtitle className="mb-2" style={{fontSize:12}}>{course.discount != 0 ? course.discount + "% Discount | " : " | "} {course.price * (100-course.discount)/100}TL</Card.Subtitle>
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
    const [minimum, setMinimum] = useState(0);
    const [maximum, setMaximum] = useState(200);
    const [order, setOrder] = useState("Price");
    const [orderDirection, setOrderDirection] = useState("ASC");
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([...Categories]);
    const [currentPage, setCurrentPage] = useState(1);
    const [courses, setCourses] = useState([]);
    const [pageCount, setPageCount] = useState(5);

    useEffect(async()=>{
        let response = await axios({
            url: "/api/course/filter",
            method: "POST",
            data: {
                minimum,maximum,order,orderDirection, search,categories, pageNumber: 1
            }
        });
        if(response.status == 200){
            setCourses(response.data);
            console.log(response.data);
        }
    },[]);

    const handleCategory = (category)=>{
        console.log(category);
        let index = categories.indexOf(category);
        let temp = [...categories];
        if(index >= 0){
            temp.splice(index, 1);
            setCategories(temp);
            console.log();
        }else{
            temp.push(category)
            setCategories(temp);
        }
    }

    const changePageChange = (newPage)=>{
        setCurrentPage(newPage);
        filter(newPage);
    }

    const filter = async (pageNumber) => {
        console.log(minimum);
        console.log(maximum);
        console.log(order);
        console.log(search);
        console.log(categories);
        console.log(pageNumber);
        let response = await axios({
            url: "/api/course/filter",
            method: "POST",
            data: {
                minimum,maximum,order,orderDirection, search,categories, pageNumber
            }
        });
        setCourses(response.data);
    }


    return (
        <Container className="mt-3 ml-5 mr-5" fluid>
            <Row className="justify-content-md-center mt-2">
                <h1>Courses</h1>
            </Row>
            <Row className="justify-content-md-center mt-2">
                <h5>You can filter and select best courses which available and </h5>
                <h5>beneficial for you, lets start.</h5>
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
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Categories</Card.Title>
                                <Card.Text>
                                        {Categories.map(category=>(<Form.Check
                                            key={category}
                                            type="checkbox"
                                            checked={categories.includes(category)}
                                            onChange={()=>handleCategory(category)}
                                            id={category}
                                            label={category}
                                        />))}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Filtering</Card.Title>
                                <Card.Text>
                                    <Form.Group controlId="formBasicRange">
                                        <Form.Label>Minimum price</Form.Label>
                                        <Form.Control type="range" value={minimum} max={maximum} step={5} onChange={(e)=>{
                                            setMinimum(e.target.value);
                                        }}/>
                                        <Form.Label>{minimum}</Form.Label>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicRange">
                                        <Form.Label>Maximum price</Form.Label>
                                        <Form.Control type="range" value={maximum} min={minimum} max={1000} step={5} onChange={(e)=>{
                                                setMaximum(e.target.value);
                                        }}/>
                                        <Form.Label>{maximum == "1000" ? "ALL" : maximum}</Form.Label>
                                    </Form.Group>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Ordering</Card.Title>
                                <Card.Text>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Example select</Form.Label>
                                        <Form.Control as="select" onChange={(e)=>{
                                            setOrder(e.target.value);
                                        }}>
                                            <option>Price</option>
                                            <option>Discount</option>
                                            <option>Rating</option>
                                        </Form.Control>
                                        <Form.Control as="select" onChange={(e)=>{
                                            setOrderDirection(e.target.value == "Ascending" ? "ASC" : "DESC")
                                        }}>
                                            <option>Ascending</option>
                                            <option>Descending</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Card.Text>
                                <Button variant="primary" onClick={()=>filter(currentPage)}>Filter</Button>
                            </Card.Body>
                        </Card>
                    </Form>
                </Col>
                <Col>
                    <Row>
                        <CardDeck>
                            {courses.map(item=>(CourseCard(item)))}
                        </CardDeck>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Pagination>{Array(pageCount).fill().map((x,number)=>(
                            <Pagination.Item key={number+1} active={number+1 === currentPage} onClick={(e)=>changePageChange(number+1)}>
                                {number+1}
                            </Pagination.Item>
                        ))}</Pagination>
                    </Row>

                </Col>
            </Row>
        </Container>
    );
}
