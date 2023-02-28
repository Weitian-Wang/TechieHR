const router = require("express").Router();
const { mkdir } = require('node:fs/promises');
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        const existQuestion = await Question.findOne({ creatorId: uid, title: req.body.title});
        if(existQuestion){
            res.status(409).send({ message: "Duplicated Question With Same Title" });
        }
        const newQuestion = new Question({
            creatorId: uid,
            title: req.body.title
        })
        await newQuestion.save()
        // WORKDIR /app
        const dirpath = `./questions/${uid}/${newQuestion.id}`
        await mkdir(dirpath, {recursive: true})
        res.status(201).send({ message: "Question created successfully" });
	} catch (error) {
        console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;