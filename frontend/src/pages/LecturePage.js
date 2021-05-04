import {
    Row,
    Col,
    Container,
    Tab,
    Tabs,
    Image,
    Spinner
} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';

export default function LecturePage(){
    const params = useParams();
    const [courseData, setCourseData] = useState(null);
    const [lectureData, setLectureData] = useState(null);
    const cid = params.cid;
    const lid = params.lid;

    useEffect( async() => {
        let courseResponse = await axios({
            url:"/api/course/retrieve/" + params.cid,
            method: "GET",
        });
        setCourseData(courseResponse.data);
        let lectureResponse = await axios({
            url:"/api/course/"+ cid + "/getLecture/" + lid,
            method: "GET",
        });
        setLectureData(lectureResponse.data);
        console.log(lectureResponse.data);
    }, []);

    if(!courseData || !lectureData){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    return (
        <Container className="mt-5" style={{width: "50vw"}}>
            <Row style={{width: "50vw"}}>
                <Col>
                    <h5>{courseData.title}</h5>
                    <h2>{lectureData.title}</h2>
                </Col>
                <Col>
                    <Row>
                        <Col>
                            <h4><strong>Chapter</strong></h4>
                            <h5>{lectureData.chapterName}</h5>
                        </Col>
                        <Col>
                            <h4><strong>Duration</strong></h4>
                            <h5>{lectureData.duration}</h5>
                        </Col>
                        <Col>
                            <h4><strong>Added Date</strong></h4>
                            <h5>{new Date(lectureData.date).toISOString().split('T')[0] }</h5>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}