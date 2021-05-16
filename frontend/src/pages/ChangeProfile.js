import {Button, Card, Col, Container, Form, Image, Jumbotron, ListGroup, Row, Toast} from "react-bootstrap";
import React, {useState, useRef, useContext, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom';
import axios from "axios";
import AuthService from "../services/AuthService";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";
import DatePicker from 'react-date-picker'

export default function ChangeProfilePage() {
    const {getCurrentUser} = useContext(AuthContext);
    let history = useHistory();
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [photo, setPhoto] = useState("");

    useEffect(async()=>{
        //let userId = (await getCurrentUser).data?.id;
    },[]);

    const changePassword = async()=>{
        let userId = (await getCurrentUser).data?.id;
        if(!userId) return;
        if(oldPassword == "" || newPassword == ""){
            setShow(true);
            setContent("Failure","Please enter password.");
            setIntent("failure");
            return;
        }
        if(oldPassword != newPassword){
            console.log("OLD: " ,oldPassword, " NEW: ", newPassword);
            setShow(true);
            setContent("Failure","Please enter new password twice.");
            setIntent("failure");
            return;
        }
        let response = await axios({
            url: "/api/user/change-password",
            method: "POST",
            data: {
                uid: userId,
                newPassword: newPassword
            }
        });
        if(response.status == 200){
            setShow(true);
            setContent("Success","Password changed successfully");
            setIntent("success");
            history.goBack();
        }else{
            console.log(response);
            setShow(true);
            setContent("Failure",response.data.message);
            setIntent("failure");
        }
    }

    const changePhoto = async()=>{
        let userId = (await getCurrentUser).data?.id;
        if(!userId) return;
        if(photo == ""){
            setShow(true);
            setContent("Failure","Please enter photo url.");
            setIntent("failure");
            return;
        }
        let response = await axios({
            url: "/api/user/change-photo",
            method: "POST",
            data: {
                uid: userId,
                photo:photo 
            }
        });
        if(response.status == 200){
            setShow(true);
            setContent("Success","Photo changed successfully");
            setIntent("success");
            history.goBack();
        }else{
            console.log(response);
            setShow(true);
            setContent("Failure",response.data.message);
            setIntent("failure");
        }
    }

    return (
        <Container className="mt-3 ml-5 mr-5 mb-5" fluid>
            <Row className="justify-content-md-center mt-2">
                <h2>Change Profile</h2>
            </Row>
            <Row>
                <Col className="mr-5">
            <Row className="justify-content-md-center mt-2">
                        <h3>Change password</h3>
                    </Row>
            <Row className="justify-content-md-center mt-2">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>New password</Form.Label>
                            <Form.Control type="password" placeholder="Enter new password" onChange={(e)=>{
                                console.log(e.target.value);
                                setOldPassword(e.target.value);
                            }}/>
                            <Form.Label>New password again</Form.Label>
                            <Form.Control type="password" placeholder="Enter new password again" onChange={(e)=>setNewPassword(e.target.value)}/>
                          </Form.Group>
                    </Row>
            <Row className="justify-content-md-center mt-2">
                        <Button onClick={()=>changePassword()}>
                            Change password
                        </Button>
                    </Row>
                </Col>
                <Col>
            <Row className="justify-content-md-center mt-2">
                        <h3>
                            Change photo 
                        </h3>
                    </Row>
            <Row className="justify-content-md-center mt-2">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>New photo url</Form.Label>
                            <Form.Control type="text" placeholder="Enter new photo url" onChange={(e)=>setPhoto(e.target.value)}/>
                          </Form.Group>
                    </Row>
            <Row className="justify-content-md-center mt-2">
                        <Button onClick={()=>changePhoto()}>
                            Change photo 
                        </Button>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
