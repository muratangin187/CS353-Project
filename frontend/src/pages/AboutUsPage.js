import {Container, Row, Col, Card} from "react-bootstrap";


export default function AboutUsPage(){
    return (
        <Card style={{margin: 20}}>
            <Card.Body>
                <Card.Title>
                    About Us
                </Card.Title>
                <Container>
                    <Row style={{marginBottom: 20}}>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title style={{textAlign: "center"}}>Personal Information</Card.Title>
                                    <Card.Text style={{display: "flex", flexDirection: "column"}}>
                                        <div style={{textAlign: "center"}}>Murat ANGIN - 21702962</div>
                                        <div style={{textAlign: "center"}}>Ümit Yiğit BAŞARAN - 21704103</div>
                                        <div style={{textAlign: "center"}}>Osman Batur İnce - 21802609</div>
                                        <div style={{textAlign: "center"}}>Muhammed Emre YILDIZ - 21702825</div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>About the Project</Card.Title>
                                    <Card.Text>
                                        We implemented an online course platform called <strong>“Ucollage”</strong>. Users are able to search for courses,
                                        buy the course they want, add courses to their wishlists, track their progress on courses, rate
                                        courses after finishing it and request a refund on bought courses with a valid reason. Course
                                        creators can publish courses, make announcements about their courses. A course consists of several
                                        lectures each of which must be completed by a user if he/she wants to get the certificate of that
                                        course. Users can create notes for lectures. Each course has a Q&A section where users ask related
                                        questions and creators answer. Site admin can offer discounts on courses whose creators allow, deals
                                        with complaints about courses by users, and approves/rejects return requests of users.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
            <Card.Footer>
                <Card.Link href="https://github.com/muratangin187/CS353-Project">GitHub</Card.Link>
            </Card.Footer>
        </Card>
    );
}