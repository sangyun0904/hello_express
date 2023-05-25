import express from "express"

import {signUp, login} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/signup", signUp)
userRouter.post("/login", login)

export { userRouter }