import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    dob: {
        type: Date,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    },{
        timestamps: true, 
      });

    const User = mongoose.model("User",userSchema);  

    export { User };