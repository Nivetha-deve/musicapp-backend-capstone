import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken"
import authRoutes from "./routes/auth.js";
import mongooseConnect from "./db-utils/mongoose-connection.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

//Middleware
app.use(express.json());
app.use(cors());


app.use("/api/auth",authRoutes);

await mongooseConnect();

app.listen(PORT, () => {
    console.log("APP listening on port" + PORT);
});

