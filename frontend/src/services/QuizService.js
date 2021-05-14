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
                    isComplete: true,
                    name: quizzes[i].name,
                    duration: quizzes[i].duration,
                    score: completedQuizzes[index].score
                };
            } else {
                result[i] = {
                    isComplete: false,
                    name: quizzes[i].name,
                    duration: quizzes[i].duration,
                };
            }
        }
        console.log(result);
        return result;
    }
}

export default new QuizService();