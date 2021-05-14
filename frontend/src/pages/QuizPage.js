import {useState} from "react";
import {Card, Container, Row, Col, Form, Button} from "react-bootstrap";
import "../style/quiz.css";

export default function QuizPage(){
    const [quizInf, setQuizInf] = useState({
        name: "Quiz Test",
        duration: "11:00"
    });

    const [quizList, setQuizList] = useState([
        {
            mode: true, //true -> TF, false -> M
            question: "True or False?",
        },
        {
            mode: true,
            question: "True or False? - 2",
        },
        {
            mode: true,
            question: "True or False? - 3",
        },
        {
            mode: false,
            question: "Select the correct choice.",
            answers: ["Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."],
        },
        {
            mode: false,
            question: "Select the correct choice. - 2",
            answers: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."],
        }
    ]);

    const handleOnChange = (event) => {
        let target = event.target;
        setQuizList(prevState => {
            let splitArr = target.name.split(".");
            let questionObj = prevState[parseInt(splitArr[1], 10)];
            questionObj.selectedAnswer = parseInt(target.value, 10);
            return (prevState);
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        alert(JSON.stringify(quizList));
    };

    return(
        <Card style={{margin: 50}}>
            <Container style={{marginTop: 10, marginBottom: 10}} fluid>
                <Row>
                    <Col><h2>{quizInf.name}</h2></Col>
                </Row>
                <Row style={{paddingBottom: 10}}>
                    <Col><p style={{fontSize: "small"}}><strong>Duration: {quizInf.duration}</strong></p></Col>
                </Row>
                <Form onSubmit={(event) => handleSubmit(event)}>
                    {
                        quizList.map((quiz, index) => {
                            return (
                                <>
                                    <Row>
                                        <Col style={{display: "flex", flexDirection: "row"}}>
                                            <p><strong>{index + 1}.</strong> {quiz.question}</p>
                                        </Col>
                                    </Row>
                                    {quiz.mode ?
                                        (<Form.Row>
                                            <Form.Group
                                                as={Col}
                                                md={6}
                                                className="tf_form_group"
                                                controlId={"tradio." + index.toString(10)}
                                            >
                                                <Form.Control
                                                    name={"tfradio." + index.toString(10)}
                                                    type="radio"
                                                    value={1}
                                                    onChange={handleOnChange}
                                                    style={{gridArea: "radio"}}
                                                />
                                                <Form.Label className="tf_form_label"><p>True</p></Form.Label>
                                            </Form.Group>
                                            <Form.Group
                                                as={Col}
                                                md={6}
                                                controlId={"fradio." + index.toString(10)}
                                                className="tf_form_group"
                                            >
                                                <Form.Control
                                                    name={"tfradio." + index.toString(10)}
                                                    type="radio"
                                                    value={0}
                                                    onChange={handleOnChange}
                                                    style={{gridArea: "radio"}}
                                                />
                                                <Form.Label className="tf_form_label"><p>False</p></Form.Label>
                                            </Form.Group>
                                        </Form.Row>)
                                        :
                                        (<>
                                            {
                                                quiz.answers.map((answer, inner_index) => {
                                                    return(
                                                        <Form.Row>
                                                            <Form.Group
                                                                as={Col}
                                                                md={12}
                                                                controlId={"mradio." + index.toString(10) + "." + inner_index.toString(10)}
                                                                className="m_form_group"
                                                            >
                                                                <Form.Control
                                                                    name={"mradio." + index.toString(10)}
                                                                    type="radio"
                                                                    value={inner_index + 1}
                                                                    onChange={handleOnChange}
                                                                    style={{gridArea: "radio"}}
                                                                />
                                                                <Form.Label className="m_form_label"><p>{answer}</p></Form.Label>
                                                            </Form.Group>
                                                        </Form.Row>
                                                    );
                                                })
                                            }
                                        </>)
                                    }

                                </>
                            );
                        })
                    }
                    <Row style={{paddingTop: "1rem"}}>
                        <Col md={{span: 4, offset: 4}}>
                            <Button style={{width: "inherit"}} type="submit">
                                <p>Submit Quiz</p>
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </Card>
    );
}