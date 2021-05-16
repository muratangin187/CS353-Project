import {Button, Card, Col, Container, Form, Image, Jumbotron, ListGroup, Row, Toast} from "react-bootstrap";
import React, {useState, useRef, useContext, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom';
import axios from "axios";
import AuthService from "../services/AuthService";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";
import DatePicker from 'react-date-picker'

export default function AdminPage() {
    const {getCurrentUser} = useContext(AuthContext);
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [refunds, setRefunds] = useState([]);
    const [percentage, setPercentage] = useState(10);
    const [updatePage, setUpdatePage] = useState(false);

    useEffect(async()=>{
        let response = await axios({
            url: "/api/course/all-courses",
            method: "GET"
        });
        setCourses(response.data);
        setSelectedCourse(response.data[0].id)

        let response2 = await axios({
            url: "/api/course/get-all-refunds",
            method: "GET"
        });
        if(response2.status == 400){
            setShow(true);
            setContent("Error,", response2.data);
            setIntent("failure");
        }else{
            console.log(response2.data);
            setRefunds(response2.data);
        }
    },[updatePage]);

    const createDiscount = async () => {
        setIntent("normal");
        setContent("Processing", "Please wait");
        setShow(true);
        let admin = (await getCurrentUser).data;
        let response = await axios({
            url: "/api/course/create-discount",
            method: "POST",
            data: {
                courseId: selectedCourse,
                startDate: startDate.toISOString().slice(0, 19).replace('T', ' '),
                endDate: endDate.toISOString().slice(0, 19).replace('T', ' '),
                percentage: percentage,
                adminId: admin.id
            }
        });
        setShow(true);
        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
        }else{
            setIntent("failure");
            setContent("Discount failed", response.data.message);
        }
    }

    const logout = async () => {
        AuthService.logout();
        setShow(true);
        setIntent("success");
        setContent("Logout", "You logout successfully.");
        window.location = window.location.origin;
    }

    const closeRefund = async (refundId, isAccepted)=>{
        let admin = (await getCurrentUser).data;
        let response = await axios({
            url: "/api/course/close-refund",
            method: "POST",
            data: {
                refundId: refundId,
                isAccepted: isAccepted,
                adminId: admin.id
            }
        });
        setShow(true);
        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
        }else{
            setIntent("failure");
            setContent("Refund close failed", response.data.message);
        }
        setUpdatePage(!updatePage);
    }

    const refundBox = (refund) => {
        return (
                <ListGroup className="m-3" style={{width:"65vw"}}>
                    <ListGroup.Item>
                        <Row>
                            <Col>1.</Col>
                            <Col xs={8} className="mr-5">
                                <h4>{refund.title}</h4>
                                <p>{refund.reason}</p>
                            </Col>
                            {refund.state == "PENDING" ? (
                                <Row className="ml-5 mr-1">
                                    <Button className="ml-auto mr-2" variant="success" type="submit" onClick={()=>closeRefund(refund.id, 1)}>
                                        Accept
                                    </Button>
                                    <Button className="ml-auto mr-2" variant="danger" type="submit" onClick={()=>closeRefund(refund.id, 0)}>
                                        Reject
                                    </Button>
                                </Row>
                            ) : (
                                <Col className="ml-5 mr-4">
                                    <Button className="ml-auto mr-2" variant="secondary" disabled type="submit">
                                        {refund.state}
                                    </Button>
                                </Col>
                            )}
                        </Row>
                        <Row className="mt-3">
                            {/*{refund.user_id}*/}
                            {/*{courses.find(c=>c.id == refund.course_id)?.name}*/}
                            <Col>
                                Course: {refund.course_title}
                            </Col>
                            <Col>
                                User: {refund.username}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>
        );
    }

    return (
        <Container className="mt-3 ml-5 mr-5" fluid>
            <Row className="justify-content-md-center mt-2">
                <h2>Admin Panel</h2>
            </Row>
            <Row>
                <Col md="auto" className="mr-5">
                    <Row>
                        <h3>Create Discount</h3>
                    </Row>
                    <Row className="mt-2">
                        Start Date:
                        <DatePicker className="ml-3" value={startDate} onChange={(d)=>{
                            if(d < endDate)
                                setStartDate(d);
                        }}/>
                    </Row>
                    <Row className="mt-2 mb-2">
                        End Date:&nbsp;&nbsp;
                        <DatePicker className="ml-3" value={endDate} onChange={(d)=>{
                            if(d > startDate)
                                setEndDate(d);
                        }}/>
                    </Row>
                    <Row>
                        <Form.Group>
                            <Form.Label>Discount Percentage</Form.Label>
                            <Form.Control type="text" placeholder="Percentage(10 for %10 discount)" onChange={e=>{
                                setPercentage(parseInt(e.target.value));
                            }}/>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Course </Form.Label>
                            <Form.Control as="select" onChange={(e)=>{
                                console.log(e.target.value);
                            }}>
                                {courses.map(c=>(<option value={c.id}>{c.category} - {c.title}</option>))}
                            </Form.Control>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Button onClick={createDiscount}>
                            Create discount
                        </Button>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <h3>
                            Refunds
                        </h3>
                    </Row>
                    <Row>
                        {refunds.map(refund=> refundBox(refund))}
                    </Row>
                </Col>
            </Row>
            <Row>
                <Link to="/stats">
                    <Button className="m-auto" variant="danger" type="submit" >
                        Statistics
                    </Button>
                </Link>
                <Button className="m-auto" variant="danger" type="submit" onClick={logout}>
                    Log out
                </Button>
            </Row>
        </Container>
    )
}
