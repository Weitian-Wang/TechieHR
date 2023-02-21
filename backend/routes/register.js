const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const { USER_ROLE } = require('../lib/constants');

router.post("/", async (req, res) => {
	try {
		req.body.role = req.body.enterprise?USER_ROLE.INTERVIEWER:USER_ROLE.INTERVIEWEE;
		delete req.body.enterprise
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already exists!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		const newUser = {
			firstName: req.body.firstName, 
			lastName: req.body.lastName,
			email: req.body.email, 
			password: hashPassword, 
			role: req.body.role
		}
		await new User(newUser).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;