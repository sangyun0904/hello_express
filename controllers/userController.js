import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

var signUp = async (req, res) => {
    const { username, password } = req.body;
    const hashpassword = await bcrypt.hash(password, 12);

    try {
        const newUser = await User.create({
            username,
            password: hashpassword,
        })
        res.status(200).json({
            status: "success",
            data: {
                user: newUser,
            }
        })
    } catch (e) {
        res.status(400).json({
            status: "fail",
            message:e
        })
    }
}

var login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({username})

        if (!user) {
            res.status(404).json({
                status: "fail",
                message: "user not found",
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect) {
            req.session.user = user;
            res.status(200).json({
                status: "success",
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: "incorrect username or password",
            })
        }

    } catch (e) {
    }
}

export {signUp, login}