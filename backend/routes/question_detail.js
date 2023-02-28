const router = require("express").Router();
const { readFile } = require('node:fs/promises');
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        const existQuestion = await Question.findOne({ _id: req.body.qid, creatorId: uid});
        if(!existQuestion){
            return res.status(409).send({ message: "Invalid Request Parameters" });
        }
        // WORKDIR /app
        const dirpath = `./questions/${uid}/${existQuestion._id}`;
        const description = await readFile(dirpath+'/description.md', {encoding: 'utf-8'});
        const grader = await readFile(dirpath+'/grader.py', {encoding: 'utf-8'})
        const solution = await readFile(dirpath+'/solution.py', {encoding: 'utf-8'})
        const data = {
            description: description,
            grader: grader,
            solution: solution
        }
        res.status(201).send({ message: "Question Files Loaded", data: data});
	} catch (error) {
        console.log(error);
        if(error.error_code != 500){
			res.status(error.error_code).send({ message: error.message });	
		}
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;