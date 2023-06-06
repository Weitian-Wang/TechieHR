const router = require("express").Router();
const { Question } = require("../models/question");
const { Interview } = require("../models/interview");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        const existQuestion = await Question.findOne({ creatorId: uid, id: req.body.qid });
        if (existQuestion == null) {
            return res.status(409).send({ message: "Question Not Exists" });
        }
        const existInterview = await Interview.find({ interviewer_id: uid, question_list: req.body.qid });
        if (existInterview.length !== 0) {
            return res.status(409).send({ message: "Question Has Interview Dependencies" });
        }
        await existQuestion.delete();
        res.status(201).send({ message: "Question Deleted", data: 201});
	} catch (error) {
        console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;