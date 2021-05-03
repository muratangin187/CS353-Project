import {
    Button,
    Card,
    Row,
    Col,
    Container,
    Tab,
    Tabs,
    Form,
    Image,
    Toast,
    Dropdown,
    DropdownButton,
    Spinner
} from "react-bootstrap";
import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';

import {useHistory} from 'react-router-dom';
import { LecturesComp, QuizzesComp } from "../components/course_comps";

export default function MainCoursePage() {
    const params = useParams();
    const [key, setKey] = useState("lectures");
    const [courseData, setCourseData] = useState(null);

    useEffect(async () => {
        let response = await axios({
            url:"/api/course/retrieve/" + params.cid,
            method: "GET",
        });
        console.log(response.status + "-Response:" + JSON.stringify(response.data,null,2));
        setCourseData(response.data);
    }, []);

    if(!courseData){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    return (
        <Container className="mt-5 ml-auto mr-auto">
            <Row>
                <Col>
                    <h5>Technology</h5>
                    <h1 className="mb-5">AWS Technology Stack</h1>
                    <p> Ace your AWS certified Cloud partitioner exam! Includes AWS certified cloud practitioner practice exams </p>
                </Col>
                <Col xs={3}>
                    <Image src="../login.png" thumbnail />
                </Col>
            </Row>
            <Tabs
            style={{"width":"100%"}}
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
    >
      <Tab eventKey="lectures" title="Lectures">
        <LecturesComp/>
      </Tab>
      <Tab eventKey="quizzes" title="Quizzes">
      <QuizzesComp/>
      </Tab>
      <Tab eventKey="qanda" title="Q/A">
      123123
      </Tab>
      <Tab eventKey="ratings" title="Ratings">
      123123
      </Tab>
      <Tab eventKey="announcements" title="Announcements">
      123123
      </Tab>
      <Tab eventKey="about" title="About">
      123123
      </Tab>
    </Tabs>
        </Container>
    );
}