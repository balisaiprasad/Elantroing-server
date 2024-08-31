import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from 'cors';
import Razorpay from 'razorpay';




dotenv.config();

export  const instance = new Razorpay({
    key_id: process.env.Razorpay_key,
    key_secret: process.env.Razorpay_Secret,
});

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;


app.get ("/", (req, res)=>{
    res.send("worlijian");
});

app.use("/uploads",express.static("uploads"));

import userRoutes from './routers/user.js';
import courseRoutes  from './routers/course.js';
import adminRoutes from './routers/admin.js';



app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);



app.listen(port, ()=>{
    console.log(`Server working on http://localhost:${port}`);
    connectDb();
});