require("dotenv").config();

const express = require("express");
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const cors = require("cors");
const app = express();

// user
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const authRoutes = require("./routes/auth");

// question 
const questionListRoutes = require("./routes/question_list")
const questionCreateRoutes = require("./routes/question_create")
const questionDetailRoutes = require("./routes/question_detail")
const questionDescriptionLoadRoutes = require("./routes/question_description_load")
const questionDescriptionSaveRoutes = require("./routes/question_description_save")
const questionGraderLoadRoutes = require("./routes/question_grader_load")
const questionGraderSaveRoutes = require("./routes/question_grader_save")
const questionSolutionLoadRoutes = require("./routes/question_solution_load")
const questionSolutionSaveRoutes = require("./routes/question_solution_save")
const questionInputLoadRoutes = require("./routes/question_input_load")
const questionInputSaveRoutes = require("./routes/question_input_save")
const questionOutputLoadRoutes = require("./routes/question_output_load")
const questionOutputSaveRoutes = require("./routes/question_output_save")
const questionSubmit = require("./routes/question_submit")
const questionSubmitTest = require("./routes/question_submit_test")


// interview

const interviewListByIntervieweeRoutes = require("./routes/interview_list_interviewee")
const interviewListByInterviewerRoutes = require("./routes/interview_list_interviewer")
const interviewCreateRoutes = require("./routes/interview_create")
const interviewDeleteRoutes = require("./routes/interview_delete")
const interviewDetailRoutes = require("./routes/interview_detail")
const interviewUpdateRoutes = require("./routes/interview_update")
const interviewQuestionDisplayInterviewer = require("./routes/interview_question_display_interviewer")
const interviewQuestionDisplayInterviewee = require("./routes/interview_question_display_interviewee")

// socket connection
const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

io.on("connection", (socket) => {
	socket.on("join", (roomId) => {
		socket.join(roomId)
		console.log(`WebSocket ${socket.id} connected to room ${roomId}`)
		socket.to(roomId).emit("userJoined", socket.id)

		socket.on("disconnect", () => {
			io.to(roomId).emit("callEnded")
			console.log(`WebSocket ${socket.id} disconnected from room ${roomId}`)
		})
	})

	socket.on("call", (data) => {
		console.log(`${data.from} called ${data.to}`)
		io.to(data.to).emit("call", { signal: data.signalData, from: data.from })
	})

	socket.on("accept", (data) => {
		console.log(`${socket.id} accepted ${data.to}`)
		io.to(data.to).emit("callAccepted", data.signalData)
	})

	socket.on("send", (data) => {
		socket.to(data.room).emit("receive", data);
	})
})

server.listen(80, () => console.log("Listening on port 80..."));

// database connection
const connectDB = require("./services/db");
connectDB();

// redis connection
const { connectRedis } = require("./services/cache");
connectRedis();

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(fileUpload())

// routes
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/auth", authRoutes);

// interview
app.use("/api/interview/list/interviewee", interviewListByIntervieweeRoutes);
app.use("/api/interview/list/interviewer", interviewListByInterviewerRoutes);
app.use("/api/interview/create", interviewCreateRoutes);
app.use("/api/interview/delete", interviewDeleteRoutes);
app.use("/api/interview/detail", interviewDetailRoutes);
app.use("/api/interview/update", interviewUpdateRoutes);
app.use("/api/interview/question/display/interviewer", interviewQuestionDisplayInterviewer);
app.use("/api/interview/question/display/interviewee", interviewQuestionDisplayInterviewee);

// question
app.use("/api/question/list", questionListRoutes);
app.use("/api/question/create", questionCreateRoutes);
app.use("/api/question/detail", questionDetailRoutes);
app.use("/api/question/description/load", questionDescriptionLoadRoutes);
app.use("/api/question/description/save", questionDescriptionSaveRoutes);
app.use("/api/question/grader/load", questionGraderLoadRoutes);
app.use("/api/question/grader/save", questionGraderSaveRoutes);
app.use("/api/question/solution/load", questionSolutionLoadRoutes);
app.use("/api/question/solution/save", questionSolutionSaveRoutes);
app.use("/api/question/input/load", questionInputLoadRoutes);
app.use("/api/question/input/save", questionInputSaveRoutes);
app.use("/api/question/output/load", questionOutputLoadRoutes);
app.use("/api/question/output/save", questionOutputSaveRoutes);
app.use("/api/question/submit", questionSubmit)
app.use("/api/question/submit/test", questionSubmitTest)

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));

process.on('uncaughtException', function (error) {
    console.log(error);
});