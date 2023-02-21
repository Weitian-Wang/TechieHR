require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

// user
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const authRoutes = require("./routes/auth");

// question 
const questionListRoutes = require("./routes/question_list")
const questionCreateRoutes = require("./routes/question_creat")

// socket connection
const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
});

io.on("connection", (socket) => {
	console.log(`WebSocket ${socket.id} connected`)

	socket.emit("socketId", socket.id)

	socket.on("call", (data) => {
		io.to(data.to).emit("call", { signal: data.signalData, from: data.from })
	})

	socket.on("accept", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})

	socket.on("end", (id) => {
		io.to(id).emit("callEnded")
	})

	socket.on("disconnect", () => {
		console.log(`WebSocket ${socket.id} disconnected`)
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

// routes
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/auth", authRoutes);

// interview

// question
app.use("/api/question/list", questionListRoutes)
app.use("/api/question/create", questionCreateRoutes)

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));