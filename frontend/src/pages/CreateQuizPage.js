import {Container, Row, Col, Form, FormGroup, Button, Card} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {NotificationContext} from "../services/NotificationContext";
import {AuthContext} from "../services/AuthContext";
import {useParams} from "react-router-dom";
import QuizService from "../services/QuizService";

export default function CreateQuizPage() {
    const {setShow, setContent, setIntent} = useContext(NotificationContext);
    const {getCurrentUser} = useContext(AuthContext);
    const [quiz, setQuiz] = useState({
        name: "",
        duration: "",
        questions: [
            {
                type: true, // true->TF, false->M
                question: "",
                answers: 1
            },
        ]

    });

    const [user, setUser] = useState(null);
    const {cid} = useParams();

    useEffect(async () => {
        let response = await getCurrentUser;
        setUser(response?.data);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIntent("normal");
        setContent("Processing", "Please wait");
        setShow(true);
        let response = await QuizService.createQuiz(user.id, cid, quiz);
        setShow(true);

        if(response){
            setIntent("success");
            setContent("Success", "Quiz is created successfully");
        }else{
            setIntent("failure");
            setContent("Quiz insertion operation failed", response.data.message);
        }
    };

    // const handleSubmit = () => {
    //     alert(JSON.stringify(quiz));
    // };

    const handleInputChange = (event) => {
        const target = event.target;
        if (target.type === "text" && target.name !== "questions"){
            setQuiz(prevState => ({
                ...prevState,
                [target.name]: target.value
            }));
        } else if (target.type === "text" && target.name === "questions") {
            setQuiz(prevState => {
                let splitArr = target.id.split(".");
                let copiedQuestions = [...(prevState.questions)];
                let questionObj = copiedQuestions[parseInt(splitArr[1], 10)];
                if (splitArr[0] === "question"){
                    questionObj.question = target.value;
                } else if (splitArr[0] === "answers"){
                    questionObj.answers[parseInt(splitArr[2], 10)] = target.value;
                }
                return ({
                    ...prevState,
                    questions: copiedQuestions
                });
            });
        }
    };

    const handleOnChange = (event) => {
        let target = event.target;
        setQuiz(prevState => {
            let splitArr = target.id.split(".");
            let copiedQuestions = [...(prevState.questions)];
            let questionObj = copiedQuestions[parseInt(splitArr[1], 10)];
            if (target.type === "radio")
                questionObj.answers = parseInt(target.value, 10);
            else
                questionObj.selectedAnswer = parseInt(target.value, 10);
            return ({
                ...prevState,
                questions: copiedQuestions
            });
        });
    };

    const handleClick = (id) => {
        let splitArr = id.split(".");
        let index = parseInt(splitArr[1]);
        let copiedQuestions = [...quiz.questions];
        let questionObj;
        if (copiedQuestions[index].type){
            questionObj = {
                type: !copiedQuestions[index].type,
                answers: ["", "", "", ""],
                question: "",
                selectedAnswer: 1
            };
        } else {
            questionObj = {
                type: !copiedQuestions[index].type,
                question: "",
                answers: 1
            };
        }

        copiedQuestions.splice(index, 1, questionObj);

        setQuiz(prevState => ({
            ...prevState,
            questions: copiedQuestions
        }));
    };

    const handleAdd = () => {
        let copiedQuestions = [...quiz.questions];
        let questionObj = {
            type: true,
            question: ""
        };

        copiedQuestions.push(questionObj);

        setQuiz(prevState => ({
            ...prevState,
            questions: copiedQuestions
        }));
    };

    const handleRemove = (id) => {
        let splitArr = id.split(".");
        let index = splitArr[1];
        let copiedQuestions = [...quiz.questions];
        copiedQuestions.splice(index, 1);

        setQuiz(prevState => ({
            ...prevState,
            questions: copiedQuestions
        }));
    };

    return (
        <Card style={{margin: 20}}>
            <Container style={{marginTop: 10, marginBottom: 10}} fluid>
                <Row id='title'>
                    <Col><h3>Create Quiz</h3></Col>
                </Row>
                <Form id='name_duration_form' onSubmit={(event) => handleSubmit(event)}>
                    <Form.Row id='name_duration'>
                        <FormGroup as={Col} controlId='name' id='name_group'>
                            <Form.Control
                                name="name"
                                type="text"
                                value={quiz.name}
                                onChange={handleInputChange}
                                placeholder='Name'/>
                        </FormGroup>
                        <FormGroup as={Col} controlId='duration' id='duration_group'>
                            <Form.Control
                                name="duration"
                                type="text"
                                value={quiz.duration}
                                onChange={handleInputChange}
                                placeholder='Duration'/>
                        </FormGroup>
                    </Form.Row>
                    <Row id='q_title'>
                        <Col>
                            <h5>Questions</h5>
                        </Col>
                    </Row>
                    {
                        quiz.questions.map((question, index) => {
                            if (question.type){
                                return (
                                    <>
                                        <h6>{index + 1}.</h6>
                                        <FormGroup controlId={"question." + index.toString(10)} className='question_group'>
                                            <Form.Control
                                                name="questions"
                                                type="text"
                                                value={quiz.questions[index].question}
                                                onChange={handleInputChange}
                                                placeholder='Question'/>
                                        </FormGroup>
                                        <Form.Row>
                                            <FormGroup as={Col} md={4} controlId={"answers." + index.toString(10)} className='answer_group' style={{display: "flex", flexDirection: "column"}}>
                                                <Form.Label><p style={{textAlign: "center"}}>True</p></Form.Label>
                                                <Form.Control
                                                    name={"radio." + index.toString(10)}
                                                    type="radio"
                                                    value={1}
                                                    checked={quiz.questions[index].answers === 1}
                                                    onChange={handleOnChange}
                                                />
                                            </FormGroup>
                                            <FormGroup as={Col} md={5} controlId={"answers." + index.toString(10)} className='answer_group' style={{display: "flex", flexDirection: "column"}}>
                                                <Form.Label><p style={{textAlign: "center"}}>False</p></Form.Label>
                                                <Form.Control
                                                    name={"radio." + index.toString(10)}
                                                    type="radio"
                                                    value={0}
                                                    checked={quiz.questions[index].answers === 0}
                                                    onChange={handleOnChange}
                                                />
                                            </FormGroup>
                                            <Col md={2}>
                                                <Button id={"button." + index.toString(10)} style={{width: "inherit"}} onClick={e => handleClick(e.target.id)}>
                                                    Multiple Choice
                                                </Button>
                                            </Col>
                                            <Col md={1}>
                                                <Button variant="danger" style={{width: "inherit"}} id={"rem_button." + index.toString(10)} onClick={e => handleRemove(e.target.id)}>
                                                    X
                                                </Button>
                                            </Col>
                                        </Form.Row>
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        <h6>{index + 1}.</h6>
                                        <FormGroup controlId={"question." + index.toString(10)} className='question_group'>
                                            <Form.Control
                                                name="questions"
                                                type="text"
                                                value={quiz.questions[index].question}
                                                onChange={handleInputChange}
                                                placeholder='Question'/>
                                        </FormGroup>
                                        <Form.Row>
                                            <FormGroup as={Col} md={6} controlId={"answers." + index.toString(10) + ".0"} id='answer'>
                                                <Form.Control
                                                    name="questions"
                                                    type="text"
                                                    value={quiz.questions[index].answers[0]}
                                                    onChange={handleInputChange}
                                                    placeholder='First Answer'/>
                                            </FormGroup>
                                            <FormGroup as={Col} md={6} controlId={"answers." + index.toString(10) + ".1"} id='answer'>
                                                <Form.Control
                                                    name="questions"
                                                    type="text"
                                                    value={quiz.questions[index].answers[1]}
                                                    onChange={handleInputChange}
                                                    placeholder='Second Answer'/>
                                            </FormGroup>
                                        </Form.Row>
                                        <Form.Row>
                                            <FormGroup as={Col} md={4} controlId={"answers." + index.toString(10) + ".2"} id='answer'>
                                                <Form.Control
                                                    name="questions"
                                                    type="text"
                                                    value={quiz.questions[index].answers[2]}
                                                    onChange={handleInputChange}
                                                    placeholder='Third Answer'/>
                                            </FormGroup>
                                            <FormGroup as={Col} md={4} controlId={"answers." + index.toString(10) + ".3"} id='answer'>
                                                <Form.Control
                                                    name="questions"
                                                    type="text"
                                                    value={quiz.questions[index].answers[3]}
                                                    onChange={handleInputChange}
                                                    placeholder='Fourth Answer'/>
                                            </FormGroup>
                                            <FormGroup as={Col} md={2} controlId={"selected_answers." + index.toString(10)} id='answer'>
                                                <Form.Control
                                                    name={"selected_answers." + index.toString(10)}
                                                    as="select"
                                                    value={quiz.questions[index].selectedAnswer}
                                                    onChange={handleOnChange}>
                                                    <option value={1}>1. Question</option>
                                                    <option value={2}>2. Question</option>
                                                    <option value={3}>3. Question</option>
                                                    <option value={4}>4. Question</option>
                                                </Form.Control>
                                            </FormGroup>
                                            <Col md={1}>
                                                <Button style={{width: "inherit"}} id={"button." + index.toString(10)} onClick={e => handleClick(e.target.id)}>
                                                    True False
                                                </Button>
                                            </Col>
                                            <Col md={1}>
                                                <Button id={"rem_button." + index.toString(10)} onClick={e => handleRemove(e.target.id)} variant="danger" style={{width: "inherit"}}>
                                                    X
                                                </Button>
                                            </Col>
                                        </Form.Row>
                                    </>
                                );
                            }
                        })
                    }
                    <Row>
                        <Col md={{span: 2, offset: 4}}>
                            <Button style={{width: "inherit"}} onClick={handleAdd}>
                                Add Question
                            </Button>
                        </Col>
                        <Col md={2}>
                            {/*<Button style={{width: "inherit"}} onClick={handleSubmit}>*/}
                            {/*    Submit*/}
                            {/*</Button>*/}
                            <Button style={{width: "inherit"}} type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </Card>
    );
}