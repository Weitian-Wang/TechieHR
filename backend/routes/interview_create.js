const router = require("express").Router();
const { Interview } = require("../models/interview");
const { User } = require("../models/user")
const { Question } = require("../models/question")
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        const data = req.body
        const interviewer = await User.findOne({ id: uid })
        const interviewee = await User.findOne({ id: data.interviewee_id })
        if(!interviewee){
            res.status(406).send({ message: "Invalid Interviewee" });
        }
        if(data.question_list.length == 0){
            res.status(406).send({ message: "Need At Least 1 Question" });
        }
        data.question_list.forEach( async (qid, index) => {
            // make sure question created by interviewer
            const q = await Question.findOne({ creatorId: uid , id: qid});
            if(!q){
                res.status(406).send({ message: "Invalid Question" });
            }
        });
        const newInterview = new Interview({
            interview_name: data.interview_name,
            interviewer_id: uid,
            interviewer_name: interviewer.firstName,
            interviewer_email: interviewer.email,
            interviewee_id: interviewee.id,
            interviewee_name: interviewee.firstName,
            interviewee_email: interviewee.email,
            scheduled_time: data.scheduled_time,
            duration: data.duration,
            question_list: data.question_list
        })
        await newInterview.save()
        res.status(201).send({ message: "Interview created successfully" });
	} catch (error) {
        console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;