const router = require("express").Router();
const { readFile } = require('node:fs/promises');
const { Interview } = require('../models/interview');
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

const languages = ['cpp', 'python', 'javascript', 'java'];

// this API is for both interviewer and interviewee
router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        const interview = await Interview.findOne({_id: req.body.interview_id, interviewer_id: uid})
        if(!interview){
            return res.status(409).send({ message: "Invalid Request Parameters" });
        }
        var list = [];
        for(var question_id of interview.question_list){
            const question = await Question.findOne({ _id: question_id, creatorId: uid });
            if(!question){
                return res.status(409).send({ message: "Missing Interview Questions"});
            }
            // WORKDIR /app
            var dirpath = `./questions/${uid}/${question._id}`;
            var description = await readFile(dirpath+'/description.md', {encoding: 'utf-8'});
            list.push({ qid: question_id, title: question.title, description: description});
        }
        var templates = {};
        for(const question_id of interview.question_list){
            templates[question_id] = {}
            for(const lang of languages){
                const template = await readFile(`./questions/${interview.interviewer_id}/${question_id}/${lang}/template`, {encoding: 'utf-8'});
                templates[question_id][lang] = template
            }
        }
        const data = {
            questions: list,
            templates: templates
        }
        return res.status(200).send({ message: "Questions Loaded", data: data })
	} catch (error) {
        console.log(error);
        if(error.error_code != 500){
			res.status(error.error_code).send({ message: error.message });	
		}
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;