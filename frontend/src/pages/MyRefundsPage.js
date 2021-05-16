import {Button, Col, Container, Form, Image, ListGroup, Modal, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";
import {useHistory} from "react-router-dom";
import axios from "axios";

export default function MyRefundsPage(){
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [refunds, setRefunds] = useState([]);

    const [courses, setCourses] = useState([]);

    const [title, setTitle] = useState("");
    const [reason, setReason] = useState("");
    const [courseId, setCourseId] = useState(0);
    const [updatePage, setUpdatePage] = useState(false);


    useEffect(async()=>{
        let response = await getCurrentUser;
        setUser(response?.data);
        let responseCourses = await axios({
            url: "/api/user/bought-courses/" + response?.data.id,
            method: "GET"
        });

        let certificates = await axios({
            url: "/api/user/getUserCertificates/" + response?.data.id,
            method: "GET"
        });

        let response2 = await axios({
            url: "/api/user/get-refunds/"+response?.data.id,
            method: "GET"
        });
        if(response2.status == 400){
            setShow(true);
            setContent("Error,", response2.data.message);
            setIntent("failure");
        }else{
            console.log(response2.data);
            setRefunds(response2.data);
        }

        if(responseCourses.status == 200 && certificates.status == 200) {
            let lastCourses = [];
            for (let i = 0; i < responseCourses.data?.length; i++) {
                if(!response2.data.map(a=>a.course_id).includes(responseCourses.data[i].id)){
                    if(certificates.data.find(c=>c.course_id == responseCourses.data[i].id) == undefined)
                        lastCourses.push(responseCourses.data[i]);
                }
            }
            console.log(lastCourses);
            setCourses(lastCourses);
            setCourseId(lastCourses[0]?.id);
        }else {
            setCourses([]);
        }

    }, [updatePage]);

    const refundBox = (refund) => {
        return(
            <ListGroup className="m-3" style={{width:"65vw"}}>
                <ListGroup.Item>
                    <Row>
                        <Col>1.</Col>
                        <Col xs={8} className="mr-5">
                            <h4>{refund.title}</h4>
                            <p>{refund.reason}</p>
                        </Col>
                        <Col className="ml-5 mr-4">
                            <Button className="ml-auto mr-2" variant={refund.state == "PENDING" ? "secondary" : (refund.state == "REJECTED" ? "danger" : "success")} disabled type="submit">
                                {refund.state}
                            </Button>
                        </Col>
                    </Row>
                    <Row className="mt-3 ml-2">
                            Course: {refund.course_title}
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        );
    }

    const makeRequest = async () => {
        setShow(true);
        setContent("Processing...", "");
        let response = await axios({
            url: "/api/course/refund",
            method: "POST",
            data: {
                courseId: courseId,
                title: title,
                reason: reason,
                userId: user.id
            }
        });
        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
        }else{
            setIntent("failure");
            setContent("Failure", response.data.message);
        }
        setModalShow(false);
        setUpdatePage(!updatePage);
    }

    return (
        <Container fluid>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create a refund request
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Please select a course and write your reason</h4>
                    <p>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Course</Form.Label>
                            <Form.Control as="select" onChange={(e)=>setCourseId(e.target.id)}>
                                {courses.map(c=>(<option value={c.id}>{c.title}</option>))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Refund title</Form.Label>
                            <Form.Control type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)}/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Your reason</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Reason" onChange={(e)=>setReason(e.target.value)}/>
                        </Form.Group>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setModalShow(false)}>Close</Button>
                    <Button variant="danger" onClick={()=>makeRequest()}>Make Refund Request</Button>
                </Modal.Footer>
            </Modal>
            <Row className="justify-content-md-center mt-5 align-items-center">
                    <h1 className="mr-5">
                        {user?.username}
                    </h1>
                    <Image
                        className="ml-5"
                        roundedCircle
                        width="200"
                        height="200"
                        src="https://www.donanimhaber.com/cache-v2/?t=20210507225737&width=-1&text=0&path=https://www.donanimhaber.com/images/images/haber/133189/340x191motosiklet-oyunu-bike-baron-2-ios-icin-on-siparise-acildi.jpg"
                    />
            </Row>
            <Row className="justify-content-md-center mt-5 align-items-center">
                <h2>Refunds</h2>
                <Button className="ml-5" variant="danger" type="submit" onClick={()=>setModalShow(true)} disabled={courses.length==0}>
                    Make refund request
                </Button>
            </Row>
            <Row className="justify-content-md-center mt-5 align-items-center">
                {refunds.map(refund=>refundBox(refund))}
            </Row>
        </Container>
    );
}
