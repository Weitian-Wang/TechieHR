const router = require("express").Router();
const { mkdir, open, writeFile, close, copyFile } = require('node:fs/promises');
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");


router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        const existQuestion = await Question.findOne({ creatorId: uid, title: req.body.title});
        if(existQuestion){
            return res.status(409).send({ message: "Duplicated Question With Same Title" });
        }
        const newQuestion = new Question({
            creatorId: uid,
            title: req.body.title
        })
        await newQuestion.save()
        // WORKDIR /app
        await writeFile(`./questions/${uid}/${newQuestion.id}`+'/description.md', `## ${req.body.title}`);
        // python
        const python_dirpath = `./questions/${uid}/${newQuestion.id}/python`
        await mkdir(python_dirpath, {recursive: true});
        await copyFile('./python_question_template_files/grader.py', python_dirpath+'/grader.py');
        await copyFile('./python_question_template_files/solution.py', python_dirpath+'/solution.py');
        await copyFile('./python_question_template_files/input', python_dirpath+'/input');
        await copyFile('./python_question_template_files/output', python_dirpath+'/output');
        // cpp, files to be changed
        const cpp_dirpath = `./questions/${uid}/${newQuestion.id}/cpp`
        await mkdir(cpp_dirpath, {recursive: true});
        await copyFile('./cpp_question_template_files/grader.py', cpp_dirpath+'/grader.py');
        await copyFile('./cpp_question_template_files/solution.py', cpp_dirpath+'/solution.py');
        await copyFile('./cpp_question_template_files/input', cpp_dirpath+'/input');
        await copyFile('./cpp_question_template_files/output', cpp_dirpath+'/output');
        res.status(201).send({ message: "Question created successfully", data: {qid: newQuestion.id, status: 201} });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;