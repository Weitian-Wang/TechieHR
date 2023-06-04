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
        await copyFile(template_dirpath+'/input', dirpath+'/input');
        await copyFile(template_dirpath+'/output', dirpath+'/output');
        // python
        const template_python_dirpath = `${template_dirpath}/python`
        const python_dirpath = `${dirpath}/python`
        await mkdir(python_dirpath, {recursive: true});
        await copyFile(template_python_dirpath+'/grader.py', python_dirpath+'/grader.py');
        await copyFile(template_python_dirpath+'/solution.py', python_dirpath+'/solution.py');
        // cpp
        const template_cpp_dirpath = `${template_dirpath}/cpp`
        const cpp_dirpath = `${dirpath}/cpp`
        await mkdir(cpp_dirpath, {recursive: true});
        await copyFile(template_cpp_dirpath+'/grader.cpp', cpp_dirpath+'/grader.cpp');
        await copyFile(template_cpp_dirpath+'/solution.cpp', cpp_dirpath+'/solution.cpp');
        // javascript
        const template_js_dirpath = `${template_dirpath}/javascript`
        const js_dirpath = `${dirpath}/javascript`
        await mkdir(js_dirpath, {recursive: true});
        await copyFile(template_js_dirpath+'/grader.js', js_dirpath+'/grader.js');
        await copyFile(template_js_dirpath+'/solution.js', js_dirpath+'/solution.js');

        res.status(201).send({ message: "Question created successfully", data: {qid: newQuestion.id, status: 201} });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;