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
    ToggleButton, Spinner,
} from "react-bootstrap";
import React, {useContext} from 'react';
import {useState, useRef, useEffect} from "react";
import axios from "axios";
import {CgWebsite} from "react-icons/cg";
import {AiFillLinkedin, AiFillYoutube} from "react-icons/ai";
import {Link} from "react-router-dom";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";


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



class QuizzesComp extends React.Component {
    constructor(props) {
        super(props);
        this.isCompleted = false;
    }
    render() {
      return (
          <Container className="ml-auto" >
            <ListGroup style={{width:"75vw"}}>
                <ListGroup.Item> 
                    <Row>
                        <Col>1.</Col>
                        <Col xs={8} className="mr-5">
                            <h4>Beginner Quiz</h4>
                            <p>What is AWS, how to use it</p>
                        </Col>
                        <Col xs={1} className="ml-5">
                        <Button className="ml-auto mr-2" variant="primary" type="submit">
                                    {this.isCompleted ? "Score 5/10" : "Take"}
                        </Button>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
          </Container>
      );
    }
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
                    window.location = window.location.origin;
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
                    window.location = window.location.origin;
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
            </Col>
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

    useEffect(() => {
        axios.get('/api/course/allAnnouncements/' + cid)
            .then(response => {
                setAnnouncementsData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const AnnouncementItem = (announcement) => {
        return (<Card style={{width:"75vw"}} className="mb-3">
            <Card.Header>{announcement.title}</Card.Header>
            <Card.Body>
                <blockquote className="blockquote mb-0">
                    <p>
                        {announcement.content}
                    </p>
                    <footer className="text-muted" style={{fontSize:"14px"}}>
                        {new Date(announcement.date).toLocaleDateString("tr-TR")}
                    </footer>
                </blockquote>
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

export {LecturesComp, QuizzesComp, QandAComp, RatingsComp, AnnouncementsComp, AboutComp, ListRatingsComp}