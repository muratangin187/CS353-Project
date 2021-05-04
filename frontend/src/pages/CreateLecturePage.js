import axios from "axios";
import {useContext, useEffect, useRef, useState} from "react";
import {Button, Card, Col, Container, Form, Toast} from "react-bootstrap";
import {useHistory, useParams} from "react-router-dom";
import {AuthContext} from "../services/AuthContext";

export default function CreateLecturePage(){
    const {cid} = useParams();
    const [result, setResult] = useState(null);
    const [toastStyle, setToastStyle] = useState({});
    const formRef = useRef(null);
    let history = useHistory();
    const {getCurrentUser} = useContext(AuthContext);
    const [user, setUser] = useState(null);

    useEffect( async() => {
        let response = await getCurrentUser;
        setUser(response?.data);
    }, []);

    const durationToTime = (duration) => {
        switch (duration.length) {
            case 0: return '00:00:00';
            case 1: return '00:00:0' + duration;
            case 2: return '00:00:' + duration;
            case 4: return '00:0' + duration;
            case 5: return '00:' + duration;
            case 7: return '0' + duration;
            case 8: return duration;
            default: return '00:00:00';
        }
    }

    const handleSubmit = async (event) => {
        setToastStyle({});
        setResult({status: 0, message: "Please wait"});
        const elements = formRef.current;

        event.preventDefault();
        let maxIdxResponse = await axios({
            url:"/api/course/maxIndex/" + cid,
            method: "GET"
        });
        console.log("Max Index Response Data: " + maxIdxResponse.data.max_index);
        let maxIndex = maxIdxResponse.data.max_index??0;
        console.log("Max Index Response Data: " + maxIndex);

        // Convert current JS Date to MySQL date
        const date = new Date();
        const mysqlDate = date.toISOString().split("T")[0];
        console.log("MySQL date: " + mysqlDate);

        const mysqlDuration = durationToTime(elements[3].value);

        let submitResponse = await axios({
            url: "/api/course/addLecture",
            method: "POST",
            data: {
                chapterName: elements[0].value,
                title: elements[1].value,
                video: elements[2].value,
                duration: mysqlDuration,
                additionalMaterial: elements[4].value,
                isVisible: elements[5].checked ? 1 : 0,
                date: mysqlDate,
                course_id: cid,
                lecture_index: maxIndex + 1
            }
        });
        setResult({status: submitResponse.status, message: submitResponse.data.message});
        setToastStyle({backgroundColor: submitResponse.status == 200 ? "rgb(200,255,200)" : "rgb(255,200,200)"});
        setTimeout(()=>{
            history.push("/");
        },1000);
    }

    return (
        <Container style={{marginTop: 20, width: "50vw"}}>
            <Card  style={{width: "50vw"}}>
                <Card.Header>Add a Lecture</Card.Header>
                <Toast show={result!=null} onClose={()=>setResult(null)} className="fixed-bottom ml-auto mr-5 mb-5">
                    <Toast.Header style={toastStyle}>
                        <strong className="mr-auto">Processing...</strong>
                        <small>time: {new Date().toLocaleTimeString("tr")}</small>
                    </Toast.Header>
                    <Toast.Body>{result?.message}</Toast.Body>
                </Toast>
                <Card.Body>
                    <Col>
                        <Form onSubmit={handleSubmit} ref={formRef}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridChapterName">
                                    <Form.Label>Chapter Name</Form.Label>
                                    <Form.Control type="text" placeholder="Chapter Name" required/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridTitle">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" placeholder="Title" required/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridVideo">
                                    <Form.Label>Video</Form.Label>
                                    <Form.Control type="text" placeholder="Video" required/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridDuration">
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control type="text" placeholder="Ex. 23, 12:24, 3:23:32" required/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group as={Col} controlId="formGridAdditionalMaterial">
                                <Form.Label>Additional Material</Form.Label>
                                <Form.Control type="text" placeholder="Additional Material"/>
                            </Form.Group>
                            <Form.Check
                                    type="switch"
                                    label="isVisible"
                                    id="isVisibleSwitch"
                                    className="ml-1"
                            />
                            <div className="mt-4" style={{textAlign: "center"}}>
                                <Button variant="success" type="submit" >
                                    Add Lecture
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Card.Body>
            </Card>
        </Container>
    )
}