const router = require("express").Router();
const { readFile } = require('node:fs/promises');
const { Interview } = require('../models/interview');
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

// this API is for both interviewer and interviewee
router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWEE]);
        const interview = await Interview.findOne({_id: req.body.interview_id, interviewee_id: uid})
        if(!interview){
            return res.status(409).send({ message: "Invalid Request Parameters" });
        }
        var list = [];
        for(var question_id of interview.question_list){
            const question = await Question.findOne({ _id: question_id, creatorId: interview.interviewer_id });
            if(!question){
                return res.status(409).send({ message: "Missing Interview Questions"});
            }
            // WORKDIR /app
            var dirpath = `./questions/${interview.interviewer_id}/${question._id}`;
            var description = await readFile(dirpath+'/description.md', {encoding: 'utf-8'});
            list.push({ qid: question._id, title: question.title, description: description});
        }
        const data = {
            questions: list,
        }
        return res.status(200).send({ message: "Questions Loaded", data: data })
	} catch (error) {
        console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;