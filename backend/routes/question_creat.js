const router = require("express").Router();
const { Question } = require("../models/question");

router.post("/", async (req, res) => {
	try {
		const list = await Question.find({ creatorEmail: req.body.email });
		res.status(200).send({data:{list:list}, message: `Found ${list.length} Items`});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;