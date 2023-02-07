require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const authRoutes = require("./routes/auth")

// database connection
const connectDB = require("./db");
connectDB();

// redis connection
const { connectRedis } = require("./cache");
connectRedis();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));