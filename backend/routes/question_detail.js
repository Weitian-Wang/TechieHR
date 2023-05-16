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
        var dirpath = `./questions/${uid}/${existQuestion._id}`;
        var data;
        // load python file
        if(req.body.lang === "python"){
            dirpath += '/python';
            const description = await readFile(dirpath+'/description.md', {encoding: 'utf-8'});
            const grader = await readFile(dirpath+'/grader.py', {encoding: 'utf-8'});
            const solution = await readFile(dirpath+'/solution.py', {encoding: 'utf-8'});
            const input = await readFile(dirpath+'/input', {encoding: 'utf-8'});
            const output = await readFile(dirpath+'/output', {encoding: 'utf-8'});
            data = {
                description: description,
                grader: grader,
                solution: solution,
                input: input,
                output: output,
            }
        }
        // load cpp file
        else if(req.body.lang === "cpp"){
            dirpath += '/cpp';
            const description = await readFile(dirpath+'/description.md', {encoding: 'utf-8'});
            const grader = await readFile(dirpath+'/grader.py', {encoding: 'utf-8'});
            const solution = await readFile(dirpath+'/solution.py', {encoding: 'utf-8'});
            const input = await readFile(dirpath+'/input', {encoding: 'utf-8'});
            const output = await readFile(dirpath+'/output', {encoding: 'utf-8'});
            data = {
                description: description,
                grader: grader,
                solution: solution,
                input: input,
                output: output,
            }
        }
        else{
            return res.status(409).send({ message: "Invalid Language Option" });
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