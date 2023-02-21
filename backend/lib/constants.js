const USER_ROLE = {
    INTERVIEWER: 1,
    INTERVIEWEE: 2
}
const INTERVIEW_STATUS = {
    SCHEDULED: 1,
    ONGOING: 2,
    // ended, canceled
    INACTIVE: 3
}

module.exports = Object.freeze({
    USER_ROLE,
    INTERVIEW_STATUS,
});