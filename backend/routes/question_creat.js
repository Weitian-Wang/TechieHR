const router = require("express").Router();
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        console.log(req);
        const newQuestion = {
            creatorId: uid,
            title: req.body.title
        }
        await Question(newQuestion).save()
        res.status(201).send({ message: "Question created successfully" });
	} catch (error) {
        console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;