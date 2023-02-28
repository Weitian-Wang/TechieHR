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
        const dirpath = `./questions/${uid}/${newQuestion.id}`
        await mkdir(dirpath, {recursive: true});
        await writeFile(dirpath+'/description.md', `## ${req.body.title}`);
        await copyFile('./question_template_files/grader.py', dirpath+'/grader.py');
        await copyFile('./question_template_files/solution.py', dirpath+'/solution.py');
        await copyFile('./question_template_files/input', dirpath+'/input');
        await copyFile('./question_template_files/output', dirpath+'/output');
        res.status(201).send({ message: "Question created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;