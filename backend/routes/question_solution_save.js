const router = require("express").Router();
const { writeFile } = require('node:fs/promises');
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

// this API is for INTERVIEWER ONLY
router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        const existQuestion = await Question.findOne({ _id: req.body.qid, creatorId: uid});
        if(!existQuestion){
            return res.status(409).send({ message: "Invalid Request Parameters" });
        }
        // WORKDIR /app
        const dirpath = `./questions/${uid}/${existQuestion._id}/${req.body.lang}`;
        if(req.body.lang === 'python'){
            await writeFile(dirpath+'/solution.py', req.body.content);
        }
        else if(req.body.lang === 'cpp'){
            // actual file to be changed
            await writeFile(dirpath+'/solution.cpp', req.body.content);
        }
        else if (req.body.lang === 'javascript') {
            await writeFile(dirpath+'/solution.js', req.body.content);
        }
        else if (req.body.lang === 'java') {
            await writeFile(dirpath+'/Solution.java', req.body.content);
        }
        else{
            return res.status(409).send({ message: "Invalid Language" });
        }
        res.status(201).send({ message: "Question Solution Saved" });
	} catch (error) {
        console.log(error);
		if(error.error_code != 500){
			res.status(error.error_code).send({ message: error.message });	
		}
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;