import {Container, Row, Col, Card} from "react-bootstrap";
import {MostBoughtCourses} from "../components/stat_comps";

export default function StatisticsPage(){
    return (
        <Card style={{margin: 20}}>
            <Card.Body>
                <Card.Title>
                    Statistics
                </Card.Title>
                <Container>
                    <Card style={{margin: 20}}>
                            <Card.Title>
                                Best selling courses 
                            </Card.Title>
                        <Card.Body>
                            <MostBoughtCourses/>
                        </Card.Body>
                        <Card.Footer>
                        </Card.Footer>
                    </Card>
                    <Card style={{margin: 20}}>
                            <Card.Title>
                                Best selling courses 
                            </Card.Title>
                        <Card.Body>
                            <MostBoughtCourses/>
                        </Card.Body>
                        <Card.Footer>
                        </Card.Footer>
                    </Card>
                    <Card style={{margin: 20}}>
                            <Card.Title>
                                Best selling courses 
                            </Card.Title>
                        <Card.Body>
                            <MostBoughtCourses/>
                        </Card.Body>
                        <Card.Footer>
                        </Card.Footer>
                    </Card>
                </Container>
            </Card.Body>
            <Card.Footer>
                <Card.Link href="https://github.com/muratangin187/CS353-Project">GitHub</Card.Link>
            </Card.Footer>
        </Card>
    );
}
