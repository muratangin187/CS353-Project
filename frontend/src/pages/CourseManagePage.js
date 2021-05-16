import {Button, Card, Col, Container, Form, Image, Jumbotron, Row, Toast} from "react-bootstrap";
import React, {useState, useRef, useContext, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom';
import axios from "axios";
import AuthService from "../services/AuthService";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";

export default function CourseManagePage(props) {
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(async ()=>{
        let response = await getCurrentUser;
        setUser(response?.data);
    }, []);

    const deleteCourse = async(cid)=>{

    }

    return (
        <Container style={{marginTop: 20}}>
            <Card style={{width:"50vw"}}>
                <Card.Body>
                    <Row className="justify-content-md-center mb-3 align-items-center">
                        <h2>Course settings</h2>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/create-lecture/" + props.courseData.id);
                        }}>
                            Create Lecture
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/course/" + props.courseData.id + "/create-quiz");
                        }}>
                            Create Quiz
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/create-announcement");
                        }}>
                            Create Announcement
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/manage-discounts/" + props.courseData.id);
                        }}>
                            Manage Discounts
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="outline-secondary" type="submit" style={{width:"35vw"}} onClick={()=>{
                            history.push("/update-course/" + props.courseData.id);
                        }}>
                            Update Course
                        </Button>
                    </Row>
                    <Row className="justify-content-md-center mt-2">
                        <Button  variant="danger" type="submit" style={{width:"35vw"}} onClick={()=>{
                            deleteCourse(props.courseData.id);
                        }}>
                           Delete Course
                        </Button>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}
