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
        const interviewer = await User.findOne({ _id: uid })
        const interviewee = await User.findOne({ email: data.email, role: 2})
        if(data.interview_name.length == 0){
            return res.status(406).send({  data: 406, message: "Empty Interview Name" });
        }
        if(data.duration.length == 0 ){
            return res.status(406).send({  data: 406, message: "Unspecified Duration" });
        }
        if(!interviewee){
            return res.status(406).send({  data: 406, message: "Invalid Interviewee" });
        }
        if(data.question_list.length == 0){
            return res.status(406).send({  data: 406, message: "Need At Least 1 Question" });
        }

        // need async check before preceed
        // !!!forEach not designed for asynchronous operations!!!
        for(qid of data.question_list){
            const q = await Question.findOne({ _id: qid });
            if(!q){
                return res.status(406).send({  data: 406, message: "Invalid Question" });
            }
        };
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
        await newInterview.save();
        res.status(201).send({ data: 201, message: "Interview created successfully" });
	} catch (error) {
        console.log(error);
        res.status(500).send({  data: 500, message: "Internal Server Error" });
	}
});

module.exports = router;