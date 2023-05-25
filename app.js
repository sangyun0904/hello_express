import RedisStore from "connect-redis"
import session from "express-session"
import {createClient} from "redis"

import {createRequire} from "module"
const require = createRequire(import.meta.url)

import express from "express";
import mongoose from "mongoose";

import { 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP, 
    MONGO_PORT, 
    SESSION_SECRET
} from "./config/config.js";

// Initialize client.
let redisClient = createClient()
redisClient.connect().catch(console.error)

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
      secure: false,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: SESSION_SECRET,
      maxAge: 30000,
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