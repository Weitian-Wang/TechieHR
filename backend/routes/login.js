const router = require("express").Router();
const { User } = require("../models/user");
const { redisClient } = require("../services/cache");
const bcrypt = require("bcrypt");
const joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const token = user.generateAuthToken();
		await redisClient.set(user.email, token);
		await redisClient.expire(user.email, process.env.TIMEOUT);
		res.status(200).send({ 
			token: token,
			email: user.email,
			// for frontend page load divergent ONLY
			// check role for backend api access control
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
			message: "Logged in Successfully"
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = joi.object({
		email: joi.string().email().required().label("Email"),
		password: joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;