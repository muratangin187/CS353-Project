import axios from "axios";
import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Card, Col, Container, Dropdown, DropdownButton, Form, Spinner, Toast} from "react-bootstrap";
import {useHistory, useParams} from "react-router-dom";
import {AuthContext} from "../services/AuthContext";
import {NotificationContext} from "../services/NotificationContext";
import {Categories} from "../constants/constants";

export default function CreateAnnouncementPage(){
    const {cid} = useParams();
    const formRef = useRef(null);
    let history = useHistory();
    const {getCurrentUser} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [courseNames, setCourseNames] = useState(null);
    const [curCourseName, setCurCourseName] = useState(null);
    const {setShow, setContent, setIntent} = useContext(NotificationContext);

    useEffect( async () => {
        let userResponse = await getCurrentUser;
        setUserData(userResponse?.data);

        let courseResponse = await axios({
            url: "/api/course/getCourseNamesOfCreator/" + userResponse.data.id,
            method: "GET",
        });
        console.log(JSON.stringify(courseResponse.data));
        console.log(JSON.stringify(courseResponse.data[0]));
        setCourseNames(courseResponse.data);
        setCurCourseName(courseResponse.data[0]);
    }, []);

    if(!userData || !courseNames || !curCourseName){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    const handleAnnouncementSubmit = async (event) => {
        setIntent("normal");
        setContent("Processing", "Please wait");
        setShow(true);

        const elements = formRef.current;
        event.preventDefault();
        let response = await axios({
            url: "/api/course/addAnnouncement",
            method: "POST",
            data: {
                title: elements[0].value,
                content: elements[1].value,
                creator_id: userData.id,
                course_id: curCourseName.id,
            }
        });

        setShow(true);
        if (response.status == 200) {
            setIntent("success");
            setContent("Success", response.data.message);
            history.goBack();
        } else {
            setIntent("failure");
            setContent("Announcement cannot be added", response.data.message);
        }
    }


    return (
        <Container style={{marginTop: 20, width: "50vw"}}>
            <Card  style={{width: "50vw"}}>
                <Card.Header>Add an Announcement</Card.Header>
                <Card.Body>
                <Col>
                    <Form onSubmit={handleAnnouncementSubmit} ref={formRef}>
                        <Form.Group as={Col} controlId="formGridTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Title" required/>
                        </Form.Group>
                        <Form.Group controlId="formGridContent">
                            <Form.Label>Your announcement...</Form.Label>
                            <Form.Control as="textarea" rows={12} required/>
                        </Form.Group>
                        <DropdownButton id="dropdown-basic-button" title={curCourseName.title} onSelect={
                            (event) => {
                                courseNames.forEach( (course) => {
                                    if(course.id == event){
                                        setCurCourseName(course);
                                    }
                                });
                            }
                        }>
                            <>
                                {courseNames.map(
                                    (courseName) => (
                                        <Dropdown.Item eventKey={courseName.id}>{courseName.title}</Dropdown.Item>
                                    )
                                )}
                            </>
                        </DropdownButton>
                        <div className="mt-2 mb-4" style={{textAlign: "center"}}>
                        <Button variant="info" type="submit" block>
                            Add Announcement
                        </Button>
                        </div>
                    </Form>
                </Col>
                </Card.Body>
            </Card>
        </Container>
    );
}
