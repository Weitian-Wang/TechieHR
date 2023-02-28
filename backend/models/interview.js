const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
        interview_name: {type: String, required: true},
        interviewer_id: {type: String, required: true},
        interviewer_name: {type: String, required: true},
        interviewer_email: {type: String, required: true},
        interviewee_id: {type: String, require: true},
        interviewee_name: {type: String, required: true},
        interviewee_email: {type: String, required: true},
        scheduled_time: {type: Date, required: true},
        duration: {type: Number, required: true},
        question_list: {type: [String], required: true}
    },
    {
        timestamps: true
    }
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = {Interview}