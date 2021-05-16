import {
    Col,
    Card,
    Container,
    ListGroup,
    Image,
    Button,
    Row,
    Tooltip,
    OverlayTrigger,
    Badge,
    Form,
    ButtonGroup,
    ToggleButton, Spinner, Modal,
} from "react-bootstrap";
import React, {useContext} from 'react';
import {useState, useRef, useEffect} from "react";
import axios from "axios";
import {CgWebsite} from "react-icons/cg";
import {AiFillLinkedin, AiFillYoutube} from "react-icons/ai";
import {Link, useHistory, useParams} from "react-router-dom";
import {AuthContext} from "../services/AuthContext";
import QuizService from "../services/QuizService";
import {NotificationContext} from "../services/NotificationContext";


function LecturesComp(props) {
    const cid = props.cid;
    const isCreator = props.isCreator;
    const [lectureData, setLectureData] = useState(null);
    const context = useContext(NotificationContext);
    const [setShowToast, setContent, setIntent] = [context.setShow, context.setContent, context.setIntent];
    const [updatePage, setUpdatePage] = useState(false);

    const deleteLecture = async (lid) => {
        let response = await axios({
            url: "/api/course/delete-lecture/",
            method: "POST",
            data: {
                lid: lid,
            }
        });
        setShowToast(true);
        if(response.data) {
            setContent("Success", "You successfully deleted a lecture.");
            setIntent("success");
        }else{
            setContent("Failure", "There is an error occurred.");
            setIntent("failure");
        }
        setUpdatePage(!updatePage);
    }

    const toggleVisibility = async (lid) => {
        let response = await axios({
            url: "/api/course/toggleVisibility/",
            method: "POST",
            data: {
                lid: lid,
            }
        });
        setShowToast(true);
        if(response.data) {
            setContent("Success", "You successfully toggled visibility of lecture with id: " + lid + ".");
            setIntent("success");
        }else{
            setContent("Failure", "There is an error occurred.");
            setIntent("failure");
        }
        setUpdatePage(!updatePage);
    }

    const LectureItem = (lecture, index) => {
        const lectureLink = "/course/" + cid + "/lecture/" + lecture.lecture_index;
        return (
                <ListGroup.Item>
                    <Row>
                        <Col>{index + 1}.</Col>
                        <Col xs={6} className="mr-5">
                            <h4>{lecture.chapterName}</h4>
                            <p>{lecture.title}</p>
                        </Col>
                        <Col xs={2} className="ml-5">
                            {isCreator ? <Button variant={!!lecture.isVisible ? "danger" : "success"} style={{height: "min-content"}} onClick={()=>toggleVisibility(lecture.id)}>
                                {!!lecture.isVisible ? "Set Invisible" : "Set Visible"}
                            </Button> : null }
                        </Col>
                        <Col xs={1} className="ml-5">
                            {isCreator ? <Button variant="danger" style={{height: "min-content"}} onClick={()=>deleteLecture(lecture.id)}>
                                Remove
                            </Button> : <Link to={lectureLink}>Watch</Link> }
                        </Col>
                    </Row>
                </ListGroup.Item>
            );
    }

      useEffect( async () => {
          if(isCreator){
              let response = await axios({
                  url:"/api/course/getAllLectures/" + cid,
                  method: "GET",
              });
              if(response.status == 200)
                  setLectureData(response.data);
          } else {
              let response = await axios({
                  url:"/api/course/getVisibleLectures/" + cid,
                  method: "GET",
              });
              if(response.status == 200)
                  setLectureData(response.data);
          }
      }, [updatePage]);

    if(!lectureData){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"20vw", height:"20vw"}} animation="border" variant="dark"/>
        </Container>);
    }
    /**
     * /course/{cid}/lecture/{lid}
     */
    return (
          <Container >
            <ListGroup style={{width:"75vw"}}>
                {lectureData.map((lecture, index) => LectureItem(lecture, index))}
            </ListGroup>
          </Container>
      );
}


function ManageDiscountsComp() {
    const {cid} = useParams();
    const courseId = cid;
    const {getCurrentUser} = useContext(AuthContext);
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const [discounts, setDiscounts] = useState([]);
    const [updatePage, setUpdatePage] = useState(false);

    useEffect(async()=>{
        let response = await axios({
            url: "/api/course/get-discounts/"+courseId,
            method: "GET"
        });
        if(response.status != 200){
            setShow(true);
            setContent("Error,", response.data.message);
            setIntent("failure");
        }else{
            let temp = [...response.data];
            for (let i = 0; i < response.data.length; i++) {
                console.log("Check discount " + response.data[i].percentage);
                let response2 = await axios({
                    url: "/api/course/discounts/"+response.data[i].id,
                    method: "GET"
                });
                console.log("Result discount " + response2.data);
                temp[i].allowed = response2.data;
            }
            console.log(temp);
            setDiscounts(temp);
        }
    }, [updatePage]);

    const allowDiscount = async(did, isAllowed) => {
        let responseUser = await getCurrentUser;
        console.log("Allow discount cid:" + responseUser.data?.id + " did:" + did);
        let response = await axios({
            url: "/api/course/allow-discount/",
            method: "POST",
            data: {
                cid: responseUser.data?.id,
                did: did,
                isAllowed: isAllowed
            }
        });
        setShow(true);
        if(response.data) {
            setContent("Success", "You successfully " + (isAllowed ? "allowed a discount." : "removed a discount."));
            setIntent("success");
        }else{
            setContent("Failure", "There is an error occured.");
            setIntent("failure");
        }
        setUpdatePage(!updatePage);
    };

    const disableDiscount = async(did) => {
        let responseUser = await getCurrentUser;
        let response = await axios({
            url: "/api/course/disable-discount/",
            method: "POST",
            data: {
                did: did,
            }
        });
        setShow(true);
        if(response.data) {
            setContent("Success", "You successfully disabled a discount.");
            setIntent("success");
        }else{
            setContent("Failure", "There is an error occured.");
            setIntent("failure");
        }
        setUpdatePage(!updatePage);
    };

    return (
        <Container className="ml-auto" >
            <h2 className="mt-5 mb-5">Manage Discounts</h2>
            <ListGroup style={{width:"75vw"}}>
                <ListGroup.Item>
                    {
                        discounts.length == 0 ? (<h2>There is no available discount.</h2>) : discounts.map((discount, index) => {
                            return(
                                <>
                                    <Row style={{marginBottom: 10}}>
                                        <Col style={{display: "flex", justifyContent: "center", alignItems: "center"}} md={1}>{index + 1}.</Col>
                                        <Col md={9}>
                                            <h4>%{discount.percentage} Discount | Price after discount: {discount.price * (100-discount.percentage) / 100}</h4>
                                            <p><strong>Start Date:</strong> {discount.startDate.substr(0,10)} | <strong>End Date:</strong> {discount.endDate.substr(0,10)}</p>
                                        </Col>
                                            {discount.allowed ? (
                                                <Col md={2} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    <Button variant="warning" style={{height: "min-content"}} onClick={()=>disableDiscount(discount.id)}>
                                                        Disable
                                                    </Button>
                                                </Col>
                                            ) : (
                                                <Col md={2} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    <Button variant="primary" style={{height: "min-content"}} onClick={()=>allowDiscount(discount.id, true)}>
                                                        Allow
                                                    </Button>
                                                    <Button variant="danger" style={{height: "min-content"}} onClick={()=>allowDiscount(discount.id, false)}>
                                                    Remove
                                                    </Button>
                                                </Col>
                                            )}
                                    </Row>
                                    <hr />
                                </>
                            );
                        })
                    }
                </ListGroup.Item>
            </ListGroup>
        </Container>
    );
}

function QuizzesComp(props) {
    const courseId = props.cid;
    const {getCurrentUser} = useContext(AuthContext);
    const [quizList, setQuizList] = useState([
        {
            isComplete: true,
            name: "test - 1",
            duration: "11:00",
            score: 5
        }
    ]);

    let history = useHistory();

    useEffect(async () => {
        let user_res = await getCurrentUser;
        console.log(user_res);

        let quizList_res = await QuizService.getCourseQuizzes(user_res.data.id, courseId);
        if (quizList_res)
            setQuizList(quizList_res);
    }, []);

    return (
      <Container className="ml-auto" >
        <ListGroup style={{width:"75vw"}}>
            <ListGroup.Item>
                {
                    quizList.map((quiz, index) => {
                        return(
                            <>
                                <Row style={{marginBottom: 10}}>
                                    <Col style={{display: "flex", justifyContent: "center", alignItems: "center"}} md={1}>{index + 1}.</Col>
                                    <Col md={9}>
                                        <h4>{quiz.name}</h4>
                                        <p><strong>Duration:</strong> {quiz.duration}</p>
                                    </Col>
                                    <Col md={2} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        <Button variant="primary" onClick={() => {history.push("/course/" + courseId.toString(10) + "/quiz/" + quiz.id.toString(10))}} style={{height: "min-content"}} disabled={quiz.isComplete}>
                                            {(quiz.isComplete) ? (quiz.score.toString(10) + "/10") : "Take"}
                                        </Button>
                                    </Col>
                                </Row>
                                <hr />
                            </>
                        );
                    })
                }
            </ListGroup.Item>
        </ListGroup>
      </Container>
    );
}

function QandAComp(props) {
    const [modalShow, setModalShow] = useState(false);
    const [question, setQuestion] = useState("");
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const [childOf, setChildOf] = useState(null);
    const [questions, setQuestions] = useState([]);
    const {getCurrentUser} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [updatePage, setUpdatePage] = useState(false);
    const [isCreator, setIsCreator] = useState(false);

    useEffect(async()=>{
        let response = await getCurrentUser;
        setUser(response?.data);
        setIsCreator(response?.data.id == props.courseData.creator_id);

        let rootQuestions = await axios({
            url: "/api/course/get-root-questions/" + props.cid,
            method: "GET"
        });

        if(rootQuestions.status == 200){
            let temp = [...rootQuestions.data];
            for(let i = 0; i < temp.length; i++){
                temp[i].children = await getChildrenRecursive(temp[i].id);
                let answer = await getAnswer(temp[i].id);
                if(answer){
                    temp[i].answer = answer;
                }
            }
            console.log(JSON.stringify(temp,null,2));
            setQuestions(temp);
        }
    },[updatePage]);

    const getChildrenRecursive = async (qid) => {
        console.log("get children recursive");
        let children = await axios({
            url: "/api/course/get-question-children/" + qid,
            method: "GET"
        });
        if(children.status == 200){
            let childrenTemp = [...children.data];
            for(let i = 0; i < childrenTemp.length; i++){
                childrenTemp[i].children = await getChildrenRecursive(childrenTemp[i].id);
                let answer = await getAnswer(childrenTemp[i].id);
                if(answer){
                    childrenTemp[i].answer = answer;
                }
            }
            return childrenTemp;
        }else{
            return [];
        }
    }

    const getAnswer = async(qid)=>{
        let response = await axios({
            url: "/api/course/get-question-answer/" + qid,
            method: "GET"
        });
        console.log("Answer for " + qid + ": " + response.data);
        return response.data;
    }

    const askQuestion = async() => {
        if(question == "" || question.length < 5){
            setShow(true);
            setContent("Failure", "Please write a longer " + (isCreator ? "answer" : "question"));
            setIntent("failure");
        }else{
            let data;
            if(childOf){
                data = {
                    content: question,
                    cid: props.cid,
                    qid: childOf,
                    uid: user.id,
                    answer: isCreator ? 1 : 0
                }
            }else{
                data = {
                    content: question,
                    cid: props.cid,
                    uid: user.id,
                    answer: isCreator ? 1 : 0
                }
            }
            let response = await axios({
                url: "/api/course/ask-question",
                method: "POST",
                data: data
            });
            if(response.status == 200){
                setShow(true);
                setIntent("success");
                setContent("Success", response.data.message);
            }else{
                setShow(true);
                setIntent("failure");
                setContent("Failure", response.data.message);
            }
            setModalShow(false);
            setUpdatePage(!updatePage);
        }
    }

    const questionComp = (question)=>{
        return (
            <div className="mt-3">
                <Row>
                    <Col className="mr-5">
                        <h4>{question.username}</h4>
                        <p>{question.content}</p>
                        <p>{question.answer ? ("Answer: " + question.answer.content ) : ""}</p>
                    </Col>
                    <Col xs="auto" style={{float: "right"}} className="ml-5">
                        {question.answer ? (<></>) : (
                        <Button variant="success" type="submit" onClick={()=>{
                            setModalShow(true);
                            setChildOf(question.id);
                        }}>
                            {isCreator ? "Answer Question" : "Ask Question"}
                        </Button>
                        )}
                    </Col>
                </Row>
                {question && question.children && question.children.length > 0 && question.children.map(q=>(<Row className="ml-5">{questionComp(q)}</Row>))}
            </div>
        );
    }

    return (
    <Container className="ml-auto" >
        <Modal
            show={modalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {isCreator ? "Answer Question" : "Ask a question"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Please write your {isCreator ? "answer" : "question"}</h4>
                <p>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>{isCreator ? "Answer" : "Question"}</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Question" onChange={(e)=>setQuestion(e.target.value)}/>
                    </Form.Group>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>setModalShow(false)}>Close</Button>
                <Button variant="danger" onClick={()=>askQuestion()}>Ask Question</Button>
            </Modal.Footer>
        </Modal>
        {(!isCreator) ? (
            <Row className="justify-content-md-center mb-2 mt-2 align-items-center">
                <Button variant="success" type="submit" onClick={()=>{
                    setModalShow(true);
                    setChildOf(null);
                }}>
                    Ask Question
                </Button>
            </Row>
        ) : (<></>)}
          <Row>
              <ListGroup style={{width:"75vw"}}>
                  {questions.map(q=>(<ListGroup.Item>{questionComp(q)}</ListGroup.Item>))}
              </ListGroup>
        </Row>
      </Container>
    );
}

function RatingsComp(props) {
    const[radioValue, setRadioValue] = useState('5');
    const cid = props.cid;
    const context = useContext(NotificationContext);
    const [setShow, setContent, setIntent] = [context.setShow, context.setContent, context.setIntent];
    const {getCurrentUser} = useContext(AuthContext);
    const formRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [completedData, setCompletedData] = useState(null);
    const [isRatedData, setIsRatedData] = useState(null);

    useEffect(async () => {
        let userResponse = await getCurrentUser;
        setUserData(userResponse?.data);

        let response = await axios({
            url:"/api/course/retrieve/" + cid,
            method: "GET",
        });
        setCourseData(response.data);

        let completedResponse = await axios({
            url: "/api/course/isCourseCompleted/" + cid + "/" + userResponse.data.id,
            method: "GET",
        });
        console.log(completedResponse.data);
        setCompletedData(completedResponse.data);

        let isRatedResponse = await axios({
            url: "/api/course/isCourseRated/" + cid + "/" + userResponse.data.id,
            method: "GET",
        });
        setIsRatedData(isRatedResponse.data);
    }, []);

    if(!courseData || !userData || completedData == null || isRatedData == null){
        if(!courseData){
            console.log("c");
        } if (!userData ) {
            console.log("u");
        } if (!completedData ) {
            console.log("comp");
        }
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    const radios = [
        {name: "1 star", value: '1'},
        {name: "2 stars", value: '2'},
        {name: "3 stars", value: '3'},
        {name: "4 stars", value: '4'},
        {name: "5 stars", value: '5'}
    ]

    const handleRatingSubmit = async (event) => {
        setIntent("normal");
        setContent("Processing", "Please wait");
        setShow(true);

        const elements = formRef.current;
        event.preventDefault();

        [...elements].forEach(element => console.log(element.value));

        if( completedData) {
            if (isRatedData) {
                let response = await axios({
                    url: "/api/course/updateRating",
                    method: "POST",
                    data: {
                        ratingScore: parseInt(radioValue),
                        content: elements[5].value,
                        user_id: userData.id,
                        course_id: cid
                    }
                });

                if(response.status == 200){
                    setIntent("success");
                    setContent("Success", response.data.message);
                } else{
                    setIntent("failure");
                    setContent("Rating cannot be updated", response.data.message);
                }
            } else {
                let response = await axios({
                    url: "/api/course/addRating",
                    method: "POST",
                    data: {
                        ratingScore: parseInt(radioValue),
                        content: elements[5].value,
                        user_id: userData.id,
                        course_id: cid
                    }
                });

                setShow(true);

                if(response.status == 200){
                    setIntent("success");
                    setContent("Success", response.data.message);
                } else{
                    setIntent("failure");
                    setContent("Rating cannot be added", response.data.message);
                }
            }
        }
    }

    let tooltips = "";
    if(completedData){
        if( isRatedData){
            tooltips = "Update your rating!";
        } else {
            tooltips = "Rate the course!";
        }
    } else {
        tooltips = "Complete your course to rate!";
    }


      return (
          <Container style={{width:"75vw"}}>
          <Row style={{width:"75vw"}}>
          <ListRatingsComp cid={cid}/>
              {props.isCreator ? null : <Col className="mt-3">
                  <h4><strong>Rate the course</strong></h4>
                  <Form onSubmit={handleRatingSubmit} ref={formRef}>
                      <ButtonGroup toggle className="mb-3">
                          {radios.map((radio, idx) => (
                              <ToggleButton
                                  key={idx}
                                  type="radio"
                                  variant="primary"
                                  name="radio"
                                  value={radio.value}
                                  checked={radioValue === radio.value}
                                  onChange={(e) => setRadioValue(e.currentTarget.value)}>
                                  {radio.name}
                              </ToggleButton>
                          ))}
                      </ButtonGroup>
                      <Form.Group controlId="formGridDescription">
                          <Form.Label>Your content</Form.Label>
                          <Form.Control as="textarea" rows={5} required/>
                      </Form.Group>
                      <Form.Row className="ml-1 mt-3">
                          <h6 className="ml-3">
                              <Badge variant="info">{tooltips}</Badge>
                          </h6>
                          <div style={{textAlign: "center"}}>
                              <Button variant="success" type="submit" disabled={!completedData}>
                                  {isRatedData ? "Update" : "Rate"}
                              </Button>
                          </div>
                      </Form.Row>
                  </Form>
              </Col>}
          </Row>
          </Container>
      );
}

function ListRatingsComp(props){
    const cid = props.cid;
    const [ratingsData, setRatingsData] = useState([]);
    const [usersData, setUsersData] = useState(null);
    const [courseData, setCourseData] = useState(null);

    useEffect(async () => {
        let response = await axios({
            url:"/api/course/retrieve/" + cid,
            method: "GET",
        });
        setCourseData(response.data);

        let ratingsResponse = await axios({
            url: "/api/course/getCourseRatings/" + cid,
            method: "GET",
        });
        console.log("Ratings response data: " + JSON.stringify(ratingsResponse.data));

        for (const rating of ratingsResponse.data) {
            let response = await axios({
                url: "/api/user/" + rating.user_id,
                method: "GET",
            });
            rating.user = response.data;
        }
        setRatingsData(ratingsResponse.data);
    }, []);

    if(!courseData || !ratingsData){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"15vw", height:"15vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    return (
                <Col className="mt-3">
                    <h4 className="text-left"><strong>Ratings</strong></h4>
                    <Row className="mb-5">
                        <Image style={{width:"16px", height:"16px"}} src="../star.png" className="mt-1 mr-2 ml-3"/>
                        <strong>{courseData.averageRating}/5</strong>
                    </Row>
                    <ListGroup>
                        {
                            ratingsData.map((rating) => {
                                console.log(JSON.stringify(rating));
                                return RatingItem(rating);
                            })
                        }
                    </ListGroup>
                </Col>
    );
}

function RatingItem(rating){
    return (<ListGroup.Item>
        <Row>
            <Col xs={10}>
                <h4>{rating.user.name + ' ' + rating.user.surname}</h4>
                <p>{rating.content}</p>
            </Col>
            <Col xs={1} className="mt-3">
                <Badge className="pl-3" variant="info"> <strong style={{fontSize: "14px"}}>{rating.ratingScore}</strong> <Image style={{width:"14px", height:"14px"}} src="../star.png" rounded className="mb-1 mr-1 ml-1"/></Badge>
            </Col>
        </Row>
    </ListGroup.Item>);
}

function AnnouncementsComp(props) {
    const cid = props.cid;
    const [announcementsData, setAnnouncementsData] = useState(null);
    const [updatePage, setUpdatePage] = useState(false);
    const context = useContext(NotificationContext);
    const [setShowToast, setContent, setIntent] = [context.setShow, context.setContent, context.setIntent];

    const deleteAnnouncement = async (aid) => {
        let response = await axios({
            url: "/api/course/delete-announcement/",
            method: "POST",
            data: {
                aid: aid,
            }
        });
        setShowToast(true);
        if(response.data) {
            setContent("Success", "You successfully deleted an announcement.");
            setIntent("success");
        }else{
            setContent("Failure", "There is an error occurred.");
            setIntent("failure");
        }
        setUpdatePage(!updatePage);
    }

    useEffect(() => {
        axios.get('/api/course/allAnnouncements/' + cid)
            .then(response => {
                setAnnouncementsData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [updatePage]);



    const AnnouncementItem = (announcement) => {
        return (<Card style={{width:"75vw"}} className="mb-3">
            <Card.Header>{announcement.title}</Card.Header>
            <Card.Body>
                <Row>
                    <Col xs={8}>
                        <blockquote className="blockquote mb-0">
                            <p>
                                {announcement.content}
                            </p>
                            <footer className="text-muted" style={{fontSize:"14px"}}>
                                {new Date(announcement.date).toLocaleDateString("tr-TR")}
                            </footer>
                        </blockquote>
                    </Col>
                    <Col xs={1}>
                        {props.isCreator ? <Button variant="danger" style={{height: "min-content"}} onClick={()=>deleteAnnouncement(announcement.id)}>
                            Delete
                    </Button> : null }
                    </Col>
                </Row>
            </Card.Body>
        </Card>);
    }



    if(!announcementsData){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    return (
        <Container className="mt-3" style={{width:"75vw"}}>
            {announcementsData.map((announcement) => AnnouncementItem(announcement))}
        </Container>
    );
}

function AboutComp(props) {
    const [courseCreator, setCourseCreator] = useState({}); // course creator JSON object

    useEffect(() => {
        // /creator-profile/:creatorId - frontend
        // /api/creator/:creatorId - backend
        axios.get('/api/creator/' + props.courseData.creator_id)
            .then(response => {
                setCourseCreator(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        console.log(props.courseData);
    }, []);

    return (
        <Container style={{width:"75vw"}}>
            <Row style={{width:"75vw"}}>
                <Col className="mt-3">
                    <h4> <strong> About Course</strong> </h4>
                    <p className="mt-2">{props.courseData.description}</p>
                </Col>
                    <Card
                        bg="light"
                        text='dark'
                        style={{ width: '18rem' }}
                        className="mb-2 mt-3"
                    >
                        <Card.Img variant="top" src={(courseCreator.photo != "placeholder.jpg") ? courseCreator.photo : "profile.png"} className="creator-img" />
                        <Card.Body style={{alignItems: "center"}}>
                            <Card.Title style={{textAlign: "center"}}> {courseCreator.name} {courseCreator.surname} </Card.Title>
                            <Card.Text style={{textAlign: "center"}}>
                                Job Of Creator
                            </Card.Text>
                        </Card.Body>
                        <Card.Body>
                            <div id="links">
                                <Button className="link_item" variant="outline-dark" href={"https://" + courseCreator.website}>
                                    <CgWebsite />
                                </Button>
                                <Button className="link_item" variant="outline-dark" href={"https://" + courseCreator.linkedin}>
                                    <AiFillLinkedin />
                                </Button>
                                <Button className="link_item" variant="outline-dark" href={"https://" + courseCreator.youtube}>
                                    <AiFillYoutube />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
            </Row>
        </Container>
    );
}

export {LecturesComp, QuizzesComp, QandAComp, RatingsComp, AnnouncementsComp, AboutComp, ListRatingsComp, ManageDiscountsComp}
