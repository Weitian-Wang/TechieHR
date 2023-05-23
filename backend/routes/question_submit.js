const router = require("express").Router();
const { writeFile } = require('node:fs/promises');
const { Question } = require("../models/question");
const { Interview } = require("../models/interview");
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

    const runCpp = async (dirpath) => {

        const { exec, spawn } = require('child_process');
        exec(`cd ${dirpath} && g++ -std=c++17 grader.cpp -o grader`, (error, stdout, stderr) => {
            if (error) {
              return res.status(201).send({ message: error.message });
            }
            if (stderr) {
              return res.status(201).send({ message: stderr });
            }

            const grader = spawn('./grader', {cwd: dirpath});
            grader.stdout.on('data', function(data) {
                message = data.toString();
            });
    
            grader.stdout.on('close', function(data) {
                return res.status(201).send({ message: message });
            });
        
            grader.stderr.on('data', (data) => {
                message = data.toString();
                console.log(message)
            });
        });

    };

	try {
        const uid = await auth(req, [USER_ROLE.INTERVIEWER, USER_ROLE.INTERVIEWEE]);
        const existInterview = await Interview.findOne({_id: req.body.interview_id});
        const existQuestion = await Question.findOne({ _id: req.body.qid });
        if(!existQuestion || !existInterview){
            return res.status(409).send({ message: "Invalid Request Parameters" });
        }
        if(existInterview.interviewer_id != uid && existInterview.interviewee_id != uid){
            return res.status(409).send({ message: "Invalid Request Parameters" });
        }
        // WORKDIR /app
        if(req.body.lang === 'python'){
            const dirpath = `./questions/${existInterview.interviewer_id}/${existQuestion._id}/${req.body.lang}`;
            await writeFile(dirpath+'/user_solution.py', req.body.solution);
            await runPy(dirpath);
        }
        else if(req.body.lang === 'cpp'){
            const dirpath = `./questions/${existInterview.interviewer_id}/${existQuestion._id}/${req.body.lang}`;
            await writeFile(dirpath+'/user_solution.cpp', req.body.solution);
            await runCpp(dirpath);
        }
        else{
            return res.status(409).send({ message: "Invalid Language" }); 
        }
	} catch (error) {
        console.log(error);
        if(error.error_code && error.error_code != 500){
			res.status(error.error_code).send({ message: error.message });	
		}
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;