const router = require("express").Router();
const { Interview } = require("../models/interview");
const { User } = require("../models/user")
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

router.post("/", async (req, res) => {
	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER]);
        const data = req.body
        const interview = await Interview.findOne({_id: data.interview_id, interviewer_id: uid})
        if(!interview){
            return res.status(406).send({  data: 406, message: "Invalid Parameters" });
        }
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
                subject: `Cancellation of Your ${interview.interview_name} Interview`,
                html: `<p>Hi ${interview.interviewee_name}, ${interviewer.firstName} cancelled your interview with you.</p><p>View all your interviews at your <a href="http://localhost:3000/">TechieHR</a> dashboard.</p><p>Contact <a href="mailto: ${interviewer.email}">${interviewer.firstName}</a> for more details or schedule another time with interviewer.</p>`,
        };
        
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
        await Interview.deleteOne({_id: data.interview_id, interviewer_id: uid});
        return res.status(201).send({ data: 201, message: "Interview Deleted" });
	} catch (error) {
        console.log(error);
        res.status(500).send({  data: 500, message: "Internal Server Error" });
	}
});

module.exports = router;