import {Container, Row, Col, Form, FormGroup, Button, Card} from "react-bootstrap";
import {useState} from "react";

export default function CreateQuizPage() {
    const [quiz, setQuiz] = useState({
        name: "",
        duration: "",
        questions: [
            {
                type: true, // true->TF, false->M
                question: ""
            },
        ]

    });

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

    const handleRadioOnChange = (event) => {
        let target = event.target;
        setQuiz(prevState => {
            let splitArr = target.id.split(".");
            let copiedQuestions = [...(prevState.questions)];
            let questionObj = copiedQuestions[parseInt(splitArr[1], 10)];
            questionObj.answers = target.value === "true";
            return ({
                ...prevState,
                questions: copiedQuestions
            });
        });
    };

    const handleSelectBoxOnChange = (event) => {
        let target = event.target;

        setQuiz(prevState => {
            let splitArr = target.id.split(".");
            let copiedQuestions = [...(prevState.questions)];
            let questionObj = copiedQuestions[parseInt(splitArr[1], 10)];
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
                question: ""
            };
        } else {
            questionObj = {
                type: !copiedQuestions[index].type,
                question: ""
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

    const handleSubmit = () => {
        alert(JSON.stringify(quiz));
    };

    return (
        <Card style={{margin: 20}}>
            <Container style={{marginTop: 10, marginBottom: 10}} fluid>
                <Row id='title'>
                    <Col><h3>Create Quiz</h3></Col>
                </Row>
                <Form id='name_duration_form'>
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
                                                    value={true}
                                                    checked={quiz.questions[index].answers === true}
                                                    onChange={handleRadioOnChange}
                                                />
                                            </FormGroup>
                                            <FormGroup as={Col} md={5} controlId={"answers." + index.toString(10)} className='answer_group' style={{display: "flex", flexDirection: "column"}}>
                                                <Form.Label><p style={{textAlign: "center"}}>False</p></Form.Label>
                                                <Form.Control
                                                    name={"radio." + index.toString(10)}
                                                    type="radio"
                                                    value={false}
                                                    checked={quiz.questions[index].answers === false}
                                                    onChange={handleRadioOnChange}
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
                                                    onChange={handleSelectBoxOnChange}>
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
                            <Button style={{width: "inherit"}} onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </Card>
    );
}