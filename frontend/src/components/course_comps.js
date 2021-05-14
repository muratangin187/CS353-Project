import {
    Col,
    Card,
    Container,
    ListGroup,
    Image,
    Button,
    Row,
    Badge,
    Form,
    ButtonGroup,
    ToggleButton, Spinner,
} from "react-bootstrap";
import React, {useContext} from 'react';
import {useState, useRef, useEffect} from "react";
import axios from "axios";
import {CgWebsite} from "react-icons/cg";
import {AiFillLinkedin, AiFillYoutube} from "react-icons/ai";
import {Link} from "react-router-dom";
import {AuthContext} from "../services/AuthContext";
import QuizService from "../services/QuizService";


function LecturesComp(props) {
      const cid = props.cid;
      const [lectureData, setLectureData] = useState(null);

    const LectureItem = (lecture, index) => {
        const lectureLink = "/course/" + cid + "/lecture/" + lecture.lecture_index;
        return (
                <ListGroup.Item>
                    <Row>
                        <Col>{index + 1}.</Col>
                        <Col xs={8} className="mr-5">
                            <h4>{lecture.chapterName}</h4>
                            <p>{lecture.title}</p>
                        </Col>
                        <Col xs={1} className="ml-5">
                            <Link to={lectureLink}>Watch</Link>
                        </Col>
                    </Row>
                </ListGroup.Item>
            );
    }

      useEffect( async () => {
          let response = await axios({
              url:"/api/course/getVisibleLectures/" + cid,
              method: "GET",
          });
          setLectureData(response.data);
      }, []);

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
    const [user, setUser] = useState(null);

    useEffect(async () => {
        let user_res = await getCurrentUser;
        console.log(user_res);
        setUser(user_res?.data);

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
                                        <Button variant="primary" style={{height: "min-content"}} disabled={quiz.isComplete}>
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

class QandAComp extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
      return (
          <Container className="ml-auto" >
            <Row>
            <ListGroup style={{width:"75vw"}}>
                <ListGroup.Item> 
                    <Row>
                        <Col>1.</Col>
                        <Col xs={8} className="mr-5">
                            <h4>Beginner Quiz</h4>
                            <p>What is AWS, how to use it</p>
                        </Col>
                        <Col xs={1} className="ml-5">
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item className="ml-5"> 
                    <Row className="ml-5">
                        <Col>1.</Col>
                        <Col xs={8} className="mr-5">
                            <h4>Beginner Quiz</h4>
                            <p>What is AWS, how to use it</p>
                        </Col>
                        <Col xs={1} className="ml-5">
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            </Row>
          </Container>
      );
    }
}

function RatingsComp() {
    const[radioValue, setRadioValue] = useState('5');
    const formRef = useRef(null);
    const radios = [
        {name: "1 star", value: '1'},
        {name: "2 stars", value: '2'},
        {name: "3 stars", value: '3'},
        {name: "4 stars", value: '4'},
        {name: "5 stars", value: '5'}
    ]

    const handleRatingSubmit = () => {}
    
      return (
          <Container style={{width:"75vw"}}>
          <Row style={{width:"75vw"}}>
          <ListRatingsComp/>
            <Col className="mt-3">
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
                    <Form.Control as="textarea" rows={5} required/>
                    <Form.Row className="ml-1 mt-3">
                        <div className="text-center" style={{"display": "flex"}}>
                            <Button variant="success" type="submit">
                                Rate
                            </Button>
                        </div>
                    </Form.Row>
                </Form>
            </Col>
          </Row>
          </Container>
      );
}

function ListRatingsComp(){
    return (
                <Col className="mt-3">
                    <h4 className="text-left"><strong>Ratings</strong></h4>
                    <Row className="mb-5">
                        <Image style={{width:"16px", height:"16px"}} src="../star.png" className="mt-1 mr-2 ml-3"/>
                        <strong>4.3/5</strong>
                    </Row>
                    <ListGroup.Item>
                        <Row>
                            <Col xs={10}>
                                <h4>Mehmet A.</h4>
                                <p>It is a really impressive course, you need to buy it</p>
                            </Col>
                            <Col xs={1} className="mt-3">
                                <Badge className="pl-3" variant="info"> <strong style={{fontSize: "14px"}}>4.8</strong> <Image style={{width:"14px", height:"14px"}} src="../star.png" rounded className="mb-1 mr-1 ml-1"/></Badge>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col xs={10}>
                                <h4>Mehmet A.</h4>
                                <p>It is a really impressive course, you need to buy it</p>
                            </Col>
                            <Col xs={1} className="mt-3">
                                <Badge className="pl-3" variant="info"> <strong style={{fontSize: "14px"}}>4.8</strong> <Image style={{width:"14px", height:"14px"}} src="../star.png" rounded className="mb-1 mr-1 ml-1"/></Badge>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </Col>
    );
}

function AnnouncementsComp() {
    return (
        <Container style={{width:"75vw"}}>
        <Card style={{width:"75vw"}}>
  <Card.Header>Server files updated</Card.Header>
  <Card.Body>
    <blockquote className="blockquote mb-0">
      <p>
        {' '}
        You need to redownload files in Lecture 25{' '}
      </p>
      <footer className="text-muted" style={{fontSize:"14px"}}>
        20 October 2020
      </footer>
    </blockquote>
  </Card.Body>
</Card></Container>
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
                                <Button className="link_item" variant="outline-dark" href={courseCreator.website}>
                                    <CgWebsite />
                                </Button>
                                <Button className="link_item" variant="outline-dark" href={courseCreator.linkedin}>
                                    <AiFillLinkedin />
                                </Button>
                                <Button className="link_item" variant="outline-dark" href={courseCreator.youtube}>
                                    <AiFillYoutube />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
            </Row>
        </Container>
    );
}

export {LecturesComp, QuizzesComp, QandAComp, RatingsComp, AnnouncementsComp, AboutComp, ListRatingsComp}