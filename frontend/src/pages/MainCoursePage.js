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

import {
    LecturesComp,
    QandAComp,
    QuizzesComp,
    RatingsComp,
    AnnouncementsComp,
    AboutComp
} from "../components/course_comps";

export default function MainCoursePage() {
    const params = useParams();
    const [key, setKey] = useState("lectures");
    const [courseData, setCourseData] = useState(null);

    useEffect(async () => {
        let response = await axios({
            url:"/api/course/retrieve/" + params.cid,
            method: "GET",
        });
        // console.log(response.status + "-Response:" + JSON.stringify(response.data,null,2));
        setCourseData(response.data);
    }, []);

    if(!courseData){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    return (
        <Container className="mt-5" style={{width: "50vw"}}>
            <Row>
                <Col>
                    <h5>{courseData.category}</h5>
                    <h1 className="mb-5">{courseData.title}</h1>
                    <p> {courseData.description} </p>
                </Col>
                <Col xs={3}>
                    <Image style={{width:"300px"}} src={courseData.thumbnail}/>
                </Col>
            </Row>
            <Tabs
            style={{"width":"75vw"}}
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
    >
      <Tab eventKey="lectures" title="Lectures">
        <LecturesComp cid={params.cid}/>
      </Tab>
      <Tab eventKey="quizzes" title="Quizzes">
      <QuizzesComp/>
      </Tab>
      <Tab eventKey="qanda" title="Q/A">
      <QandAComp/>
      </Tab>
      <Tab eventKey="ratings" title="Ratings">
        <RatingsComp/>
      </Tab>
      <Tab eventKey="announcements" title="Announcements">
       <AnnouncementsComp/>
      </Tab>
      <Tab eventKey="about" title="About">
       <AboutComp courseData={courseData}/>
      </Tab>
    </Tabs>
        </Container>
    );
}