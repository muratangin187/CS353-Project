import {Button, Card, Col, Container, Form, Image, Jumbotron, ListGroup, Row, Spinner, Toast} from "react-bootstrap";
import React, {useState, useRef, useContext, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom';
import axios from "axios";
import AuthService from "../services/AuthService";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";

export default function MyCertificatesPage() {
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [certificatesData, setCertificatesData] = useState(null);

    useEffect( async () => {
        let userResponse = await getCurrentUser;
        setUser(userResponse?.data);

        const uid = userResponse?.data.id;
        let certificateResponse = await axios({
            url:"/api/user/getUserCertificates/" + uid,
            method: "GET",
        });
        console.log(certificateResponse.data);
        setCertificatesData(certificateResponse.data);
    }, []);

    if(user == null || certificatesData == null){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }
    const CertificateItem = (certificate, index) => {
        const courseLink = "/course/" + certificate.course_id;
        return (
            <ListGroup.Item>
                <Row>
                    <Col>{index + 1}.</Col>
                    <Col xs={8} className="mr-5">
                        <h4>{certificate.name}</h4>
                    </Col>
                    <Col xs={2} className="ml-5">
                        <Link to={courseLink}>Go to Course</Link>
                    </Col>
                </Row>
            </ListGroup.Item>
        );
    }
    return (
        <Container style={{width:"75vw", marginTop: 20}}>
            <Jumbotron style={{width:"75vw"}}>
                <h1>My Certificates</h1>
                <p>
                    Here, all of your certificates are listed.
                </p>
            </Jumbotron>
            <ListGroup style={{width:"75vw", marginTop: 20}}>
                {certificatesData.map((certificate, index) => CertificateItem(certificate, index))}
            </ListGroup>
        </Container>
    )
}