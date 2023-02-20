const redis = require("redis");

const redisClient = redis.createClient({
    url: process.env.REDIS
});
    

const connectRedis = () => {
    (async () => {
        await redisClient.connect();
    })();
      
    redisClient.on("ready", () => {
        console.log("Connected to cache succesfully");
    });
      
    redisClient.on("error", (error) => {
        console.log(error);
        console.log("Could not connect to cache");
    });
}

module.exports = {connectRedis, redisClient}