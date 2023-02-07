const router = require("express").Router();
const { redisClient } = require("../cache");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
	try {
        const expectedToken = await redisClient.get(req.body.email);
        if (!expectedToken)
            return res.status(401).send({ message: "Token Expired" });

        if (expectedToken != req.body.token)
            return res.status(401).send({ message: "Invalid Token" });

        const token = jwt.sign({_id: this._id, timestamp: Date.now()}, process.env.JWTPRIVATEKEY);
        await redisClient.set(req.body.email, token);
        await redisClient.expire(req.body.email, process.env.TIMEOUT);
		res.status(200).send({ token: token, email: req.body.email, message: "Token Refreshed" });
	} catch (error) {
        console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;