const router = require("express").Router();
const { mkdir, copyFile } = require('node:fs/promises');
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

        const template_dirpath = './questions/template_question'
        // WORKDIR /app
        const dirpath = `./questions/${uid}/${newQuestion.id}`
        await mkdir(dirpath, {recursive: true});
        await copyFile(template_dirpath+'/description.md', dirpath+'/description.md');
        // python
        const template_python_dirpath = `${template_dirpath}/python`
        const python_dirpath = `${dirpath}/python`
        await mkdir(python_dirpath, {recursive: true});
        await copyFile(template_python_dirpath+'/grader.py', python_dirpath+'/grader.py');
        await copyFile(template_python_dirpath+'/solution.py', python_dirpath+'/solution.py');
        await copyFile(template_python_dirpath+'/input', python_dirpath+'/input');
        await copyFile(template_python_dirpath+'/output', python_dirpath+'/output');
        // cpp, files to be changed
        const template_cpp_dirpath = `${template_dirpath}/cpp`
        const cpp_dirpath = `${dirpath}/cpp`
        await mkdir(cpp_dirpath, {recursive: true});
        await copyFile(template_cpp_dirpath+'/grader.cpp', cpp_dirpath+'/grader.cpp');
        await copyFile(template_cpp_dirpath+'/solution.cpp', cpp_dirpath+'/solution.cpp');
        await copyFile(template_cpp_dirpath+'/input', cpp_dirpath+'/input');
        await copyFile(template_cpp_dirpath+'/output', cpp_dirpath+'/output');
        res.status(201).send({ message: "Question created successfully", data: {qid: newQuestion.id, status: 201} });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;