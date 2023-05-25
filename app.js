import RedisStore from "connect-redis"
import session from "express-session"
import {createClient} from "redis"

import express from "express";
import mongoose from "mongoose";

import { 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP, 
    MONGO_PORT, 
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET
} from "./config/config.js";

// Initialize client.
let redisClient = createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
})
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect();

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

import { postRouter } from "./routes/postRoutes.js"
import { userRouter } from "./routes/userRoutes.js"

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL)
        .then(() => console.log("succesfully connected to DB"))
        .catch((e) => {
            console.log(e)
            setTimeout(connectWithRetry, 5000)
    });
}

connectWithRetry();

// Initialize sesssion storage.
app.use(
    session({
      store: redisStore,
      secret: SESSION_SECRET,
      cookie: {
        secure: false,
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        httpOnly: true,
        maxAge: 60000,
      }
    })
  )

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h2>Hi There!!!</h2>")
});

app.use("/posts", postRouter);
app.use("/users", userRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`))