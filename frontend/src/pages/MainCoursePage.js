import {
    Row,
    Col,
    Container,
    Tab,
    Tabs,
    Image,
    Spinner
} from "react-bootstrap";
import React, {useState, useEffect, useContext} from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';

import {
    LecturesComp,
    QandAComp,
    QuizzesComp,
    RatingsComp,
    AnnouncementsComp,
    AboutComp, ManageDiscountsComp
} from "../components/course_comps";
import {AuthContext} from "../services/AuthContext";

export default function MainCoursePage() {
    const params = useParams();
    const [key, setKey] = useState("lectures");
    const [courseData, setCourseData] = useState(null);
    const {getCurrentUser} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [boughtData, setBoughtData] = useState(null);

    useEffect(async () => {
        let userResponse = await getCurrentUser;
        setUserData(userResponse?.data);
        let response = await axios({
            url:"/api/course/retrieve/" + params.cid,
            method: "GET",
        });
        // console.log(responseget.status + "-Response:" + JSON.stringify(response.data,null,2));
        setCourseData(response.data);
        let boughtResponse = await axios({
            url:"/api/course/isCourseBought/" + params.cid + "/" + userResponse.data.id,
            method: "GET",
        });
        setBoughtData(boughtResponse.data);
    }, []);

    if(!courseData || !userData || boughtData == null){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    if(!boughtData && !userData.isCreator){
        return (
            <Container fluid>
                <Row className="justify-content-md-center mt-2">
                    <h2>You cannot see this page</h2>
                </Row>
                <Row className="justify-content-md-center mt-2">
                    <h2>You have not bought this course</h2>
                </Row>
        </Container>);
    } else if (userData.isCreator && userData.id != courseData.creator_id){
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
        <Container className="mt-5" style={{width: "75vw"}}>
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
      <QandAComp  cid={params.cid} courseData={courseData}/>
      </Tab>
      <Tab eventKey="ratings" title="Ratings">
        <RatingsComp cid={params.cid}/>
      </Tab>
      <Tab eventKey="announcements" title="Announcements">
       <AnnouncementsComp cid={params.cid}/>
      </Tab>
      <Tab eventKey="discounts" title="Manage Discounts">
          <ManageDiscountsComp cid={params.cid}/>
      </Tab>
      <Tab eventKey="about" title="About">
       <AboutComp courseData={courseData}/>
      </Tab>
    </Tabs>
        </Container>
    );
}