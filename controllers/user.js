import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import sendMail from "../middleware/sendMail.js";
import TryCatch from "../middleware/TryCatch.js";

// Registration
export const register = TryCatch(async (req, res) => {
    const { email, name, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({
            message: "User Already Exists",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user = {
        name,
        email,
        password: hashPassword,
    };

    const otp = Math.floor(Math.random() * 10000);

    const activationToken = jwt.sign({
        user,
        otp,
    }, process.env.Activation_Secretkey, {
        expiresIn: "5m",
    });

    const data = {
        name,
        otp,
    };

    await sendMail(
        email,
        "E Learning",
        data
    );

    res.status(200).json({
        message: "OTP HAS BEEN SENT",
        activationToken,
    });
});

// Verify User
export const verifyUser = TryCatch(async (req, res) => {
    const { otp, activationToken } = req.body;

    try {
        const verify = jwt.verify(activationToken, process.env.Activation_Secretkey);

        if (verify.otp !== otp) {
            return res.status(400).json({
                message: "Incorrect OTP",
            });
        }

        await User.create({
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.password,
        });

        res.json({
            message: "User Successfully Registered",
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid or Expired Token",
        });
    }
});

// Login User
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User Does Not Exist",
        });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        return res.status(400).json({
            message: "Incorrect Password",
        });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });

    res.json({
        message: `Welcome ${user.name}`,
        token,
        user,
    });
});

// Get User Profile
export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            message: "User Not Found",
        });
    }

    res.json({ user });
});
