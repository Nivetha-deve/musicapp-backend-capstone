import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken"
import authRoutes from "./routes/auth.js";
import mongooseConnect from "./db-utils/mongoose-connection.js"
import userRouter from "./routes/Profile.js";
import musicRouter from "./routes/music.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

//Middleware
app.use(express.json());
app.use(cors());

const authAllApi = (req,res,next) => {
    try {
const token = req.headers["authorization"];
jwt.verify(token,process.env.JWT_SECRET);
next();
}catch (err) {
    console.log(err.message);
    //err
    res.status(403).send({msg: "Unauthorized"});
}
};

app.use("/api/auth",authRoutes);
app.use("/api/user",authAllApi,userRouter);
app.use("/api/music",authAllApi,musicRouter)

await mongooseConnect();

mongooseConnect().then(() => {
app.listen(PORT, () => {
    console.log("APP listening on port" + PORT);
});
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

