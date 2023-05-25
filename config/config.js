var MONGO_IP = process.env.MONGO_IP || "mongo"
var MONGO_PORT = process.env.MONGO_PORT || 27017
var MONGO_USER = process.env.MONGO_USER
var MONGO_PASSWORD = process.env.MONGO_PASSWORD
var REDIS_URL = process.env.REDIS_URL || "redis"
var REDIS_PORT = process.env.REDIS_PORT || 6379
var SESSION_SECRET = process.env.SESSION_SECRET

export {
    MONGO_IP,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASSWORD,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET
}