require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");

// database connection
const connection = require("./db");
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));