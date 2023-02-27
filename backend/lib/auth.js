const { redisClient } = require("../services/cache");
const jwt = require("jsonwebtoken");

// extract token from request header
// check if token expired
// decode check if role in roles list
class TokenError extends Error {
    constructor(message, error_code) {
      super(message); // (1)
      this.name = "TokenError";
      this.error_code = error_code;
    }
}

const auth = async (req, roles) => {
    try{
        const token = req.headers.authorization.substring(7);
        var payload;
        try{
            payload = jwt.verify(token, process.env.JWTPRIVATEKEY);
        }
        catch (error){
            throw new TokenError(error.message, 401);
        }
        // check if expired with redis 
        const cachedToken = await redisClient.get(payload.email);
        if(!cachedToken){
            throw new TokenError("Token Expired", 401);
        }
        // role access permission check
        if(!roles.includes(payload.role)){
            throw new TokenError("Role Doesn't Have Permission", 401);
        }
        // refresh token expire time in redis
        await redisClient.set(payload.email, token);
        await redisClient.expire(payload.email, process.env.TIMEOUT);
        // return user id for future use
        return payload._id
    }
    catch (error){
        throw error;
    }
}

module.exports = {auth}