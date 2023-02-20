const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionId: {type: String, required: true},
    creatorId: {type: String, required: true},
    creatorEmail: {type: String, required: true}
});

const Question = mongoose.model("Question", questionSchema);

module.exports = {Question}