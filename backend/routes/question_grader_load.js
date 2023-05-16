const router = require("express").Router();
const { readFile } = require('node:fs/promises');
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
        var data;
        // python
        const dirpath = `./questions/${uid}/${existQuestion._id}/${req.body.lang}`;
        if(req.body.lang === 'python'){
            const grader = await readFile(dirpath+'/grader.py', {encoding: 'utf-8'});
            data = {
                grader: grader,
            }
        }
        // cpp
        else{
            const grader = await readFile(dirpath+'/grader.py', {encoding: 'utf-8'});
            data = {
                grader: grader,
            }
        }
        res.status(201).send({ message: "Question Grader Loaded", data: data});
	} catch (error) {
        console.log(error);
		if(error.error_code != 500){
			res.status(error.error_code).send({ message: error.message });	
		}
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;