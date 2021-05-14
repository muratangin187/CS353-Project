import {
    Row,
    Col,
    Container,
    Tab,
    Tabs,
    Image,
    ListGroup,
    Spinner, Form, Button, Card
} from "react-bootstrap";
import React, {useState, useEffect, useRef, useContext} from "react";
import {Link, useHistory, useParams} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from "../services/AuthContext";
import {NotificationContext} from "../services/NotificationContext";

export default function LecturePage(){
    const params = useParams();
    let history = useHistory();
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const [courseData, setCourseData] = useState(null);
    const [lectureData, setLectureData] = useState(null);
    const [notesData, setNotesData] = useState(null);
    const [bookmarksData, setBookmarksData] = useState(null);
    const [lectureCompletedData, setLectureCompletedData] = useState(null);
    const [buttonDisableData, setButtonDisableData] = useState(null);
    const {getCurrentUser} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const noteFormRef = useRef(null);
    const bookmarkFormRef = useRef(null);
    const cid = params.cid;
    const lid = params.lid;

    useEffect( async() => {
        let userResponse = await getCurrentUser;
        setUserData(userResponse?.data);

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

        const lecturePrimaryID = lectureResponse.data.id;
        const uid = userResponse?.data.id;
        let notesResponse = await axios({
            url:"/api/course/" + lecturePrimaryID + "/allNotes/" + uid,
            method: "GET",
        });
        console.log(notesResponse.data);
        setNotesData(notesResponse.data);

        let completeLectureResponse = await axios({
            url: `/api/course/isLectureCompleted/${params.cid}/${lecturePrimaryID}/${uid}`,
            method: "GET",
        });
        console.log("CompleteLectureResponse.data: " + completeLectureResponse.data);
        setLectureCompletedData(completeLectureResponse.data);
        setButtonDisableData(completeLectureResponse.data);

        let bookmarksResponse = await axios({
            url:"/api/course/" + lecturePrimaryID + "/allBookmarks/" + uid,
            method: "GET",
        });
        console.log(bookmarksResponse.data);
        setBookmarksData(bookmarksResponse.data);
    }, [params.lid]);

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

    if(!courseData || !lectureData || !userData || !notesData || !bookmarksData || lectureCompletedData == null || buttonDisableData == null){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }
    const handleNoteSubmit = async (event) => {
        setIntent("normal");
        setContent("Processing", "Please wait");
        setShow(true);

        const elements = noteFormRef.current;
        event.preventDefault();
        let response = await axios({
            url: "/api/course/addNote",
            method: "POST",
            data: {
                title: elements[0].value,
                content: elements[1].value,
                user_id: userData.id,
                lecture_id: lectureData.id,
            }
        });

        setShow(true);
        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
        }else{
            setIntent("failure");
            setContent("Note cannot be added", response.data.message);
        }
    }

    const durationRegex = (duration) => {
        let reg = /((0-9)|:)+/;
        return reg.test(duration);
    }

    const handleBookmarkSubmit = async (event) => {
        setIntent("normal");
        setContent("Processing", "Please wait");
        setShow(true);
        const elements = bookmarkFormRef.current;
        event.preventDefault();
        const timestamp = durationToTime(elements[0].value);

        setShow(true);
        console.log(`Timestamp: ${timestamp}, Course Duration: ${lectureData.duration}`);
        if (timestamp.localeCompare(lectureData.duration) === 1 || !durationRegex(timestamp)){
            setContent("Bookmark cannot be added", "Check your timestamp");
            return;
        }

        let response = await axios({
            url: "/api/course/addBookmark",
            method: "POST",
            data: {
                timestamp: durationToTime(elements[0].value),
                user_id: userData.id,
                lecture_id: lectureData.id,
            }
        });

        setShow(true);

        if(response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
        } else{
            setIntent("failure");
            setContent("Bookmark cannot be added", response.data.message);
        }
    }

    const goToPreviousLecture = async () => {
        let response = await axios({
            url:"/api/course/getLectureIndices/" + params.cid,
            method: "GET",
        });
        const indices = response.data;
        const curLectureIndex = lectureData.lecture_index;
        let prevIndex = -1;
        let prevId = -1;


        indices.forEach(e => {
            let element = e.lecture_index;
            if(element < curLectureIndex && element > prevIndex){
                prevIndex = element;
                prevId = e.id;
            }
        });

        setShow(true);
        console.log(indices);
        console.log(`curlectureindex: ${curLectureIndex}, prevIndex: ${prevIndex}`);

        if(prevId != -1){
            setIntent("success");
            setContent("Success", "You are being redirected");
            setTimeout(()=>{
                history.push(`/course/${cid}/lecture/${prevId}`);
            },1000);
        } else{
            setIntent("failure");
            setContent("Error", "There is no previous lecture");
        }
    }

    const goToNextLecture = async () => {
        let response = await axios({
            url:"/api/course/getLectureIndices/" + params.cid,
            method: "GET",
        });
        const indices = response.data;
        const curLectureIndex = lectureData.lecture_index;
        let nextIndex = Number.MAX_SAFE_INTEGER;
        let nextId = -1;

        indices.forEach(e => {
            let element = e.lecture_index;
            if(element > curLectureIndex && element < nextIndex){
                nextIndex = element;
                nextId = e.id;
            }
        });

        setShow(true);
        console.log(indices);
        console.log(`curlectureindex: ${curLectureIndex}, nextIndex: ${nextIndex}`);

        if(nextId != -1){
            setIntent("success");
            setContent("Success", "You are being redirected");
            setTimeout(()=>{
                history.push(`/course/${cid}/lecture/${nextId}`);
            },1000);
        } else{
            setIntent("failure");
            setContent("Error", "There is no next lecture");
        }
    }

    const onCompleteLecture = async () => {
        let response = await axios({
            url: "/api/course/completeLecture",
            method: "POST",
            data: {
                uid: userData.id,
                cid: courseData.id,
                lid: lectureData.id,
            }
        });

        setShow(true);
        if( response.status == 200){
            setIntent("success");
            setContent("Success", response.data.message);
            setButtonDisableData(true);
        } else {
            setIntent("failure");
            setContent("Transaction cannot be processed", response.data.message);
        }
    }

    const noteItem = (note) => {
        return (
            <Card style={{width: "75vw"}}>
                <Card.Body>
                    <Card.Title><strong>{note.title}</strong></Card.Title>
                    <Card.Subtitle style={{fontSize: "12px"}}>{new Date(note.date).toLocaleDateString("tr-TR")}</Card.Subtitle>
                    <Card.Text className="mt-1">{note.content}</Card.Text>
                </Card.Body>
            </Card>
        )
    }

    const bookmarkItem = (bookmark) => {
        return (
            <Card style={{width: "75vw"}}>
                <Card.Body>
                    <Card.Title><strong>{bookmark.videoTimestamp.split(".")[0]} <span style={{fontSize: "10px"}}> {" / " + new Date(bookmark.date).toLocaleDateString("tr-TR")}</span> </strong></Card.Title>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Container className="mt-5" style={{width: "50vw"}}>
            <Row style={{width: "75vw", backgroundColor:"#f0f0f0"}}>
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
                            <h5>{lectureData.duration.split(".")[0]}</h5>
                        </Col>
                        <Col>
                            <h4><strong>Added Date</strong></h4>
                            <h5>{new Date(lectureData.date).toLocaleDateString("tr-TR")}</h5>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mt-4" style={{width: "75vw"}}>
                <Col>
                    <h5>Video</h5>
                </Col>
                <Row style={{width: "75vw"}}>
                    <Col style={{width: "60vw"}}>
                        <div style={{width: "50vw", height: "30vw", backgroundColor: "#a0a0a0", alignItems: "center", textAlign:"center", justifyContent:"center", verticalAlign:"center"}}>
                            <strong>Video Block</strong>
                        </div>
                        <Row className="ml-5 mt-2">
                            <Col><Button onClick={goToPreviousLecture}>Previous Lecture</Button></Col>
                            <Col><Button onClick={onCompleteLecture} disabled={buttonDisableData}>Complete Lecture</Button></Col>
                            <Col><Button onClick={goToNextLecture}>Next Lecture</Button></Col>
                        </Row>
                            <div className="ml-5">
                                <Form onSubmit={handleBookmarkSubmit} ref={bookmarkFormRef} style={{textAlign: "center"}} className="ml-5 mt-3">
                                    <Form.Group as={Row} controlId="formGridPrice" style={{width: "20vw"}}>
                                        <Form.Label>Add Bookmark</Form.Label>
                                        <Form.Control type="text" placeholder="ex. 12:35 (Press Enter)" required/>
                                    </Form.Group>
                                </Form>
                            </div>
                    </Col>
                    <Col className="ml-2" style={{width: "20vw"}}>
                        <Form onSubmit={handleNoteSubmit} ref={noteFormRef}>
                            <Form.Group controlId="formGridNoteTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Note title" required/>
                            </Form.Group>
                            <Form.Group controlId="formGridNote">
                                <Form.Label>Your note...</Form.Label>
                                <Form.Control as="textarea" rows={12} required/>
                            </Form.Group>
                            <div className="mt-2 mb-4" style={{textAlign: "center"}}>
                                <Button variant="secondary" type="submit" block>
                                    Add Note
                                </Button>
                            </div>
                            <Card>
                                <Card.Header>Additional Material</Card.Header>
                                <Card.Body>
                                    <Link to={"/" + lectureData.additionalMaterial}>Additional Material Link</Link>
                                </Card.Body>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </Row>
            <Row className="mt-4" style={{width: "75vw"}}>
                <h3><strong>Notes</strong></h3>
                <ListGroup>
                    {notesData.map((note) => noteItem(note))}
                </ListGroup>
            </Row>
            <Row className="mt-4" style={{width: "75vw"}}>
                <h3><strong>Bookmarks</strong></h3>
                <ListGroup>
                    {bookmarksData.map((bookmark) => bookmarkItem(bookmark))}
                </ListGroup>
            </Row>
        </Container>
    );
}