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
        await Interview.deleteOne({_id: data.interview_id, interviewer_id: uid});
        return res.status(201).send({ data: 201, message: "Interview Deleted" });
	} catch (error) {
        console.log(error);
        res.status(500).send({  data: 500, message: "Internal Server Error" });
	}
});

module.exports = router;