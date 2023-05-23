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
        const interview = await Interview.findOne({ _id: data.interview_id, interviewer_id: uid});
        const interviewer = await User.findOne({ _id: uid })
        const interviewee = await User.findOne({ email: data.email, role: 2})
        if(!interview){
            return res.status(406).send({  data: 406, message: "Invalid Interview" });
        }
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
        await Interview.findOneAndUpdate({ _id: data.interview_id}, {
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

        // send email to candidate
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'techiehraws1@gmail.com',
            pass: 'jbiicrzzsjevseku'
        }
        });
        
        var mailOptions = {
                from: 'techiehraws1@gmail.com',
                to: interview.interviewee_email,
                subject: `Reschedule of Your ${interview.interview_name} Interview`,
                html: `<p>Hi ${interview.interviewee_name}, ${interviewer.firstName} updated your interview. The interview was moved to ${data.scheduled_time.replace(/T/, ' ').replace(/\..+/, '')} and would take ${data.duration} minutes. Good luck!</p><p>View all your interviews at your <a href="http://localhost:3000/">TechieHR</a> dashboard.</p><p>Contact <a href="mailto:${interviewer.email}">${interviewer.firstName}</a> for more details or schedule another time with interviewer.</p>`,
        };
        
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
        res.status(201).send({ data: 201, message: "Interview Updated" });
	} catch (error) {
        console.log(error);
        res.status(500).send({  data: 500, message: "Internal Server Error" });
	}
});

module.exports = router;