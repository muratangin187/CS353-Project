import {Button, Col, Container, Form, Image, ListGroup, Modal, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";
import {useHistory} from "react-router-dom";
import axios from "axios";

export default function MyNotificationPage(){
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const [updatePage, setUpdatePage] = useState(false);


    useEffect(async()=>{
        let response = await getCurrentUser;
        setUser(response?.data);

        let response2 = await axios({
            url: "/api/user/get-notifications/"+response?.data.id,
            method: "GET"
        });
        setNotifications(response2.data);
    }, [updatePage]);

    const notificationBox = (notification) => {
        return(
            <ListGroup className="m-3" style={{width:"65vw"}}>
                <ListGroup.Item>
                    <Row>
                        <Col xs={6}>
                            <h4>{notification.title}</h4>
                            <p>{notification.content}</p>
                        </Col>
                        {notification.state ? (
                        <Col className="ml-5 mr-4">
                            <Button className="ml-auto mr-2" variant={notification.state == "PENDING" ? "secondary" : (notification.state == "REJECTED" ? "danger" : "success")} disabled type="submit">
                                {notification.state}
                            </Button>
                        </Col>
                        ) : (<Col></Col>)}
                        <Col className="mr-4">
                            <Button className="ml-auto mr-2" variant={"danger"} type="submit" onClick={()=>dismissNotification(notification.id)}>
                                Dismiss
                            </Button>
                        </Col>
                    </Row>
                    <Row className="mt-3 ml-2">
                            Course: {notification.course_title}
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        );
    }

    const dismissNotification = async (nid) => {
        let response = await axios({
            url: "/api/user/remove-notification/" + nid,
            method: "GET"
        });
        setShow(true);
        if(response.status == 200){
            setContent("Success", "Successfully dissmissed notification");
            setIntent("success");
            setUpdatePage(!updatePage);
        }else{
            setContent("Failure", "A problem occurred on dissmiss notification process");
            setIntent("failure");
        }
    }

    return (
        <Container fluid>
            <Row className="justify-content-md-center mt-5 align-items-center">
                    <h1 className="mr-5">
                        My Notifications
                    </h1>
            </Row>
            <Row className="justify-content-md-center mt-5 align-items-center">
                {notifications.map(notification=>notificationBox(notification))}
            </Row>
        </Container>
    );
}
