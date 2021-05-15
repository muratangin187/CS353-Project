import {Container, Row, Col, Image, Card, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import '../style/creator_profile.css';
import {AiFillYoutube, AiFillLinkedin} from "react-icons/ai"
import {CgWebsite} from "react-icons/cg"

export default function CreatorProfilePage(){
    const {creatorId} = useParams();
    const [courseCreator, setCourseCreator] = useState({}); // course creator JSON object

    useEffect(() => {
        // /creator-profile/:creatorId - frontend
        // /api/creator/:creatorId - backend
        axios.get('/api/creator/' + creatorId)
            .then(response => {
                setCourseCreator(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div id="creator_page_div">
            <Card id="creator_card">
                <Card.Body>
                    <Container id="creator_page" fluid>
                        <Row id="creator_name_photo">
                            <Col>
                                <div className="creator_name">
                                    <h1>{courseCreator.name} {courseCreator.surname}</h1>
                                </div>
                            </Col>
                            <Col style={{justifyContent: "flex-end", display: "flex"}}>
                                {
                                    (courseCreator.photo != "placeholder.jpg") ?
                                    (<Image src={courseCreator.photo} roundedCircle />)
                                    : (<Image src="profile.png" roundedCircle style={{width: 150}}/>)
                                }

                            </Col>
                        </Row>
                        <Row id="creator_about">
                            <Col>
                                {
                                    courseCreator.about ?
                                    (   <div>
                                            <h3>About Creator</h3>
                                            <p>{courseCreator.about}</p>
                                        </div>
                                    )
                                    : (<p>Course creator doesn't have any information</p>)
                                }
                            </Col>
                        </Row>
                        <Row id="creator_links">
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
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </div>
    );
}