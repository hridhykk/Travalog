import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required :  true
    },
    email:{
        type : String,
        required :  true,
        unique : true
    },
    password:{
        type : String,
        required :  true
    },
    mobile:{
        type : String,
        required :  true
    },
    image:{
        type : String,
       default : 'Unknown_person.jpg'
    },
    is_blocked:{
        type : Boolean,
        default :false
    },
},{versionKey:false,timestamps:true})



export default mongoose.model('User',userSchema)