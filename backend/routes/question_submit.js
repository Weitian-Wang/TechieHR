const router = require("express").Router();
const { writeFile } = require('node:fs/promises');
const { Question } = require("../models/question");
const { auth } = require("../lib/auth");
const { USER_ROLE } = require("../lib/constants");

router.post("/", async (req, res) => {
    const runPy = async (dirpath) => {

        const { spawn } = require('child_process');
        const pyprog = spawn('python3', ['./grader.py'], {cwd: dirpath});
        var message;

        pyprog.stdout.on('data', function(data) {
            message = data.toString();
        });

        pyprog.stdout.on('close', function(data) {
            return res.status(201).send({ message: message });
        });
    
        pyprog.stderr.on('data', (data) => {
            message = data.toString();
            console.log(message)
        });
    };

	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER, USER_ROLE.INTERVIEWEE]);
        const existQuestion = await Question.findOne({ _id: req.body.qid });
        if(!existQuestion){
            return res.status(409).send({ message: "Invalid Request Parameters" });
        }
        // WORKDIR /app
        const dirpath = `./questions/${uid}/${existQuestion._id}`;
        await writeFile(dirpath+'/user_solution.py', req.body.solution);
        await runPy(dirpath);
	} catch (error) {
        console.log(error);
        if(error.error_code && error.error_code != 500){
			res.status(error.error_code).send({ message: error.message });	
		}
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;