const router = require("express").Router();
const { readFile } = require('node:fs/promises');
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

const languages = new Set(['cpp', 'python', 'javascript', 'java']);

// this API is for INTERVIEWER ONLY
router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        const existQuestion = await Question.findOne({ _id: req.body.qid, creatorId: uid});
        if(!existQuestion){
            return res.status(409).send({ message: "Invalid Request Parameters" });
        }
        // WORKDIR /app
        if (!languages.has(req.body.lang)) {
            return res.status(409).send({ message: "Invalid Language" });
        }
        const dirpath = `./questions/${uid}/${existQuestion._id}/${req.body.lang}`;
        const template = await readFile(dirpath+'/template', {encoding: 'utf-8'});
        const data = {
            template: template
        }
        res.status(201).send({ message: "Question Template Loaded", data: data});
	} catch (error) {
        console.log(error);
        if(error.error_code != 500){
			res.status(error.error_code).send({ message: error.message });	
		}
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;