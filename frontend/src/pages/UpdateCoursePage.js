import {
    Row,
    Col,
    Container,
    Tab,
    Tabs,
    Image,
    Spinner, Form, Button
} from "react-bootstrap";
import React, {useState, useEffect, useContext} from "react";
import {useParams, useHistory} from 'react-router-dom';
import axios from 'axios';

import {AuthContext} from "../services/AuthContext";
import {NotificationContext} from "../services/NotificationContext";

export default function UpdateCoursePage() {
    const params = useParams();
    const [courseData, setCourseData] = useState(null);
    const {getCurrentUser} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [title, setTitle] = useState("");
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [thumbnail, setThumbnail] = useState("");
    const history = useHistory();

    useEffect(async () => {
        let userResponse = await getCurrentUser;
        setUserData(userResponse?.data);
        let response = await axios({
            url:"/api/course/retrieve/" + params.cid,
            method: "GET",
        });
        // console.log(responseget.status + "-Response:" + JSON.stringify(response.data,null,2));
        setCourseData(response.data);
    }, []);

    if(!courseData || !userData){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    const changeTitle = async () => {
        console.log(title);
        if (title == ""){
            setShow(true);
            setContent("Error,", "Title cannot be empty");
            setIntent("failure");
            return;
        }
        let response = await axios({
            url: "/api/course/updateTitle",
            method: "POST",
            data: {
                id: courseData.id,
                title: title,
            }
        });

        setShow(true);
        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
        } else{
            setIntent("failure");
            setContent("Course cannot be updated", response.data.message);
        }
    }

    const changeThumbnail = async () => {
        if (thumbnail == ""){
            setShow(true);
            setContent("Error,", "Thumbnail cannot be empty");
            setIntent("failure");
            return;
        }
        let response = await axios({
            url: "/api/course/updateThumbnail",
            method: "POST",
            data: {
                id: courseData.id,
                thumbnail: thumbnail,
            }
        });

        setShow(true);
        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
        } else{
            setIntent("failure");
            setContent("Course cannot be updated", response.data.message);
        }
    }

    const changeDescription = async () => {
        if (description == ""){
            setShow(true);
            setContent("Error,", "Description cannot be empty");
            setIntent("failure");
            return;
        }
        let response = await axios({
            url: "/api/course/updateDescription",
            method: "POST",
            data: {
                id: courseData.id,
                description: description,
            }
        });

        setShow(true);
        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
        } else{
            setIntent("failure");
            setContent("Course cannot be updated", response.data.message);
        }
    }

    const changePrice = async () => {
        if (price == 0){
            setShow(true);
            setContent("Error,", "Price cannot be empty");
            setIntent("failure");
            return;
        }
        let response = await axios({
            url: "/api/course/updatePrice",
            method: "POST",
            data: {
                id: courseData.id,
                price: price,
            }
        });

        setShow(true);
        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
        } else{
            setIntent("failure");
            setContent("Course cannot be updated", response.data.message);
        }
    }

    const removeCourse = async () => {
        let response = await axios({
            url: "/api/course/delete-course/",
            method: "POST",
            data: {
                id: courseData.id,
            }
        });
        setShow(true);
        if(response.data) {
            setContent("Success", "You successfully deleted a course.");
            setIntent("success");
            history.goBack();
        }else{
            setContent("Failure", "There is an error occurred.");
            setIntent("failure");
        }
    }

    if (userData.isCreator && userData.id != courseData.creator_id){
        return (<Container fluid>
            <Row className="justify-content-md-center mt-2">
                <h2>You cannot see this page</h2>
            </Row>
            <Row className="justify-content-md-center mt-2">
                <h2>You are not the creator of this course</h2>
            </Row>
        </Container>);
    }

    return (
        <Container className="mt-3 ml-5 mr-5" fluid>
            <Row className="justify-content-md-center mt-2">
                <h2>Update Course</h2>
            </Row>
            <Row style={{width: "70vw"}}>
                    <Col xs={3}>
                        <Form.Group>
                            <Form.Label>Change Title</Form.Label>
                            <Form.Control type="text" placeholder="New title" onChange={e=>{
                                setTitle(e.target.value);
                            }}/>
                            <Button variant="success" onClick={() => {changeTitle()}}>
                                Change Title
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Change Description </Form.Label>
                            <Form.Control placeholder="New description" as="textarea" onChange={(e)=>{
                                setDescription(e.target.value);
                            }} rows={5}/>
                            <Button variant="success" onClick={() => {changeDescription()}}>
                                Change Description
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group>
                            <Form.Label>Change thumbnail</Form.Label>
                            <Form.Control type="text" placeholder="New thumbnail" onChange={e=>{
                                setThumbnail(e.target.value);
                            }}/>
                            <Button variant="success" onClick={() => changeThumbnail()}>
                                Change Thumbnail
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group>
                            <Form.Label>Change price</Form.Label>
                            <Form.Control type="text" placeholder="New price (TL)" onChange={e=>{
                                setPrice(parseInt(e.target.value));
                            }}/>
                            <Button variant="success" onClick={() => {changePrice()}}>
                                Change Price
                            </Button>
                        </Form.Group>
                    </Col>
            </Row>
        </Container>
    );
}