import express from "express";
import bcrypt from "bcrypt";
import { User } from "../db-utils/models.js"
import jwt from "jsonwebtoken";

const router = express.Router();

//Register

router.post("/register", async(req,res) => {
    const{name, dob, email, password,id=Date.now(), confirmPassword, gender} = req.body;
    console.log('Incoming request body:', req.body);

    if (password !== confirmPassword) {
        return res.status(400).json({message: "Password do not match "})
    }

    try{
        const existUser = await User.findOne({ email });
        if(existUser){
            return res.status(400).json({message: "User alraedy registered"})
        }
        const hashPassword = bcrypt.hashSync(password,10);
        
        const newUser = new User({
             name,
             email,
             password: hashPassword,
             dob,
             gender,
             id,
        });
      await newUser.save();
      
      const token = jwt.sign({ id: newUser._id, name: newUser.email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

      res.status(201).json({
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            dob: newUser.dob,
            gender: newUser.gender,
        },
    });
        // message:"User registered successfully"});

    }catch (error){
        console.error("Server error:", error);
        res.status(500).json({message: "Server error", error});
    }
});

//Login
router.post("/login", async (req,res) => {
    const {email,password} = req.body;
    
    try{
      const user = await User.findOne ( { email });
      if(!user){
        return res.status(400).json({message:"Invalid email or password"})
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(400).json({message: "Invalid email or password"})
      }
      const token = jwt.sign({id: user._id, name: user.email}, process.env.JWT_SECRET, {
          expiresIn: "1d",
      });
      res.json({
        token,
        user: {id: user._id, name: user.name, email: user.email, dob: user.dob, gender: user.gender}
      });
    } catch (error){
      console.error("Server error:", error);
      res.status(500).json({message: "Server error", error});
    }
});

export default router;