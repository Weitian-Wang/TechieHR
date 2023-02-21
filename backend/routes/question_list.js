const router = require("express").Router();
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

router.post("/", async (req, res) => {
	try {
		await auth(req, [USER_ROLE.INTERVIEWEE]);
		const list = await Question.find({ creatorEmail: req.body.email });
		res.status(200).send({data:{list:list}, message: `Found ${list.length} Items`});
	} catch (error) {
		console.log(error);
		if(error.error_code != 500){
			res.status(error.error_code).send({ message: error.message });	
		}
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;