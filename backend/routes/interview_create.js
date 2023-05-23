const router = require("express").Router();
const { Interview } = require("../models/interview");
const { User } = require("../models/user")
const { Question } = require("../models/question")
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");
const { nodemailer } = require('nodemailer');

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
        to: interviewee.email,
        subject: `${interviewer.firstName} Scheduled an Interview with You!`,
        html: `<h1>Congrats!</h1><p>Hi ${interviewee.firstName}, we are thrilled to notify you that ${interviewer.firstName} has scheduled an interview with you. The interview starts at ${data.scheduled_time.replace(/T/, ' ').replace(/\..+/, '')} and takes ${data.duration} minutes. Good luck!</p><p>View all your interviews at your <a href="http://localhost:3000/">TechieHR</a> dashboard.</p><p>Contact <a href="mailto: ${interviewer.email}">${interviewer.firstName}</a> for more details or schedule another time with interviewer.</p>`,
        };
        
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
        res.status(201).send({ data: 201, message: "Interview created successfully" });
	} catch (error) {
        console.log(error);
        res.status(500).send({  data: 500, message: "Internal Server Error" });
	}
});

module.exports = router;