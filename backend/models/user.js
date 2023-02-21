const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    // INTERVIEWER 1
    // INTERVIEWEE 2
    role: {type: Number, required: true},
});

userSchema.methods.generateAuthToken = function() {
    // decode token, check role and get _id for queries
    // trust token
    const token = jwt.sign({_id: this._id, role: this.role, timestamp: Date.now()}, process.env.JWTPRIVATEKEY);
    return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
    const schema = joi.object({
        firstName: joi.string().required().label("First Name"),
        lastName: joi.string().required().label("Last Name"),
        email: joi.string().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        role: joi.number().integer().required().label("Role"),
    })
    return schema.validate(data);
}

module.exports = {User, validate};