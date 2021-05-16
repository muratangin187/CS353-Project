import axios from "axios";

class QuizService{
    async createQuiz(creatorId, courseId, quiz){
        let name = quiz.name;
        let duration = quiz.duration;

        let insertQuizRes = await axios.post("/api/quiz/insert_quiz", {
            creatorId,
            courseId,
            name,
            duration
        });

        if (insertQuizRes.status !== 200)
            return insertQuizRes;

        let quizId = insertQuizRes.data.quiz_id;

        for (let i = 0; i < quiz.questions.length; i++){
            let questionObj = quiz.questions[i];
            let question = questionObj.question;

            let insertFlashRes = await axios.post("/api/quiz/insert_flash", {
                question,
                quizId
            });

            if (insertFlashRes.status != 200)
                return insertFlashRes;

            let flashId = insertFlashRes.data.flash_id;

            if (questionObj.type){
                let answer = questionObj.answers;
                let insertTrueFalse = await axios.post("/api/quiz/insert_true_false", {
                    answer,
                    flashId
                });

                if (insertTrueFalse.status != 200)
                    return insertTrueFalse;
            } else {
                let choice1 = questionObj.answers[0];
                let choice2 = questionObj.answers[1];
                let choice3 = questionObj.answers[2];
                let choice4 = questionObj.answers[3];
                let answer = questionObj.selectedAnswer;
                let insertMultiple = await axios.post("/api/quiz/insert_multiple", {
                    choice1,
                    choice2,
                    choice3,
                    choice4,
                    answer,
                    flashId
                });

                if (insertMultiple.status != 200)
                    return insertMultiple;
            }
        }

        return 1;
    }

    async getCourseQuizzes(userId, courseId){
        console.log("getCourseQuizzes START");
        let quizzes;
        await axios.get("/api/quiz/retrieve_quizzes/" + courseId.toString(10))
            .then(response => {
                quizzes = response;
            });
        console.log("quizzes");
        if (quizzes.status == 400)
            return null;

        quizzes = quizzes.data;
        console.log(quizzes);

        let completedQuizzes;
        await axios.get("/api/quiz/retrieve_completed_quizzes/" + courseId.toString(10) + "/" + userId.toString(10))
            .then(response => {
                completedQuizzes = response;
            });

        if (completedQuizzes.status == 400)
            return null;

        console.log(completedQuizzes);
        completedQuizzes = completedQuizzes.data;
        let idArr = completedQuizzes.map(obj => {
            return obj.id;
        });
        console.log(idArr);
        let result = [];

        for (let i = 0; i < quizzes.length; i++){
            if (idArr.includes(quizzes[i].id)){
                let index = idArr.findIndex(id => id === quizzes[i].id);
                result[i] = {
                    id: quizzes[i].id,
                    isComplete: true,
                    name: quizzes[i].name,
                    duration: quizzes[i].duration,
                    score: completedQuizzes[index].score
                };
            } else {
                result[i] = {
                    id: quizzes[i].id,
                    isComplete: false,
                    name: quizzes[i].name,
                    duration: quizzes[i].duration,
                };
            }
        }
        console.log(result);
        return result;
    }

    async getQuizInf(qid){
        let inf;
        await axios.get("/api/quiz/retrieve_quiz_inf/" + qid.toString(10))
            .then(response => {
                inf = response
            });

        if (inf.status == 400)
            return null;

        inf = inf.data[0];
        console.log(inf);

        return inf;
    }

    async getQuizQA(qid){
        let trueFalseQuestions;
        await axios.get("/api/quiz/retrieve_quiz_qa_tf/" + qid.toString(10))
            .then(response => {
                trueFalseQuestions = response;
            });

        if (trueFalseQuestions.status == 400)
            return null;

        trueFalseQuestions = trueFalseQuestions.data;
        console.log(trueFalseQuestions);

        let tfConfQuestions = trueFalseQuestions.map((obj) => {
            obj.mode = true;
            return obj;
        });

        let multipleChoiceQuestions;
        await axios.get("/api/quiz/retrieve_quiz_qa_m/" + qid.toString(10))
            .then(response => {
                multipleChoiceQuestions = response;
            });

        if (multipleChoiceQuestions.status == 400)
            return null;

        multipleChoiceQuestions = multipleChoiceQuestions.data;
        console.log(multipleChoiceQuestions);

        let mConfQuestions = multipleChoiceQuestions.map((obj) => {
            obj.mode = false;
            let arr = [obj.choice1, obj.choice2, obj.choice3, obj.choice4];

            delete obj.choice1;
            delete obj.choice2;
            delete obj.choice3;
            delete obj.choice4;

            obj.answers = arr;
            return obj;
        });

        let mergedArr = [...tfConfQuestions, ...mConfQuestions];
        return mergedArr.sort((f, s) => f.id - s.id);
    }

    async insertCompletedQuiz(quizId, userId, score){
        return await axios.post("/api/quiz/insert_completed_quiz", {
            quizId,
            userId,
            score
        });
    }

    async getCourseQuizStats(courseId){
        let numOfAttArr = await axios.get("/api/quiz/retrieve_attend/" + courseId.toString(10));

        if (numOfAttArr.status == 400)
            return numOfAttArr;

        console.log("Num of attr");
        console.log(numOfAttArr);

        numOfAttArr = numOfAttArr.data;
        numOfAttArr.sort((f, s) => f.id - s.id);

        let avgScoreArr = await axios.get("/api/quiz/retrieve_avg_score/" + courseId.toString(10));

        if (avgScoreArr.status == 400)
            return avgScoreArr;

        avgScoreArr = avgScoreArr.data;
        avgScoreArr.sort((f, s) => f.id - s.id);

        let quizzes = await axios.get("/api/quiz/retrieve_quizzes/" + courseId.toString(10));

        if (quizzes.status == 400)
            return quizzes;

        quizzes = quizzes.data;
        quizzes.sort((f, s) => f.id - s.id);

        return quizzes.map(quiz => {
            let index = numOfAttArr.findIndex(obj => obj.id == quiz.id);
            console.log("index");
            console.log(index);
            console.log(quiz.id);
            console.log(numOfAttArr);
            if(index != -1){
                return {
                    name: quiz.name,
                    duration: quiz.duration,
                    avgScore: avgScoreArr[index].count,
                    numAttend: numOfAttArr[index].count
                };
            } else {
                return {
                    name: quiz.name,
                    duration: quiz.duration,
                    avgScore: 0,
                    numAttend: 0
                };
            }
        });

    }

    async isCreator(userId){
        let result;
        await axios.get("/api/quiz/retrieve_is_creator/" + userId.toString(10))
            .then(response => {
                result = response;
            });

        return result;
    }
}


export default new QuizService();
