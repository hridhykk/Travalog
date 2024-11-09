import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateWebTokens.js';
import bcrypt from 'bcrypt'




const securePassword = async (password)=>{
    try {
        const hashBcrypt = await bcrypt.hash(password,10);
        if(hashBcrypt) return hashBcrypt

    } catch (error) {
        console.log(error.message);
    }
}



const registerUser=async(req,res)=>{
    try {
        const {name,email,mobile,password} = req.body;
        const emailExits = await User.findOne({email:email});
        if(emailExits){
            res.json({ status: "emailExits" });
        }else{
            const hashedPassword = await securePassword(password)
            if(hashedPassword){
                const newUser = new User({
                    name: name,
                    email:email,
                    mobile:mobile,
                    password : hashedPassword
                });
                await newUser.save();
                res.json({status:"success"})
            }
        }
            
    } catch (error) {
        console.log(error.message);
    }
}




const verifyLogin = async (req, res) => {
    try {
        console.log('my name is hridhya k kkkk');
       
        const { email, password } = req.body;
        console.log(req.body.email)
        const findUser = await User.findOne({ email: email });
        
        if (findUser && !findUser.is_blocked) {
            const isPasswordMatch = await bcrypt.compare(password, findUser.password);
            if (isPasswordMatch) {
                const token = generateToken({ id: findUser._id });
                let data = {};
                
                for (let key in findUser.toObject()) {
                    if (key !== 'password') {
                        data[key] = findUser[key];
                    }
                }
                
                // Set the token as an HTTP-only cookie
                res.cookie('jwt', token, {
                    httpOnly: true,   // Prevents client-side JavaScript from accessing the cookie
                    secure: process.env.NODE_ENV === 'production',  // Ensures the cookie is sent over HTTPS in production
                    maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days in milliseconds
                });
                
               
                res.json({
                    status: "success",
                    data: data,
                    token:token
                });
            } else {
                res.json({ status: "incorrect" });
            }
        } else {
            res.json({ status: "usernotfound" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "error", message: error.message });
    }
};




const profileEdit=async(req,res)=>{
    try {
        const {name,mobile,userId} = req.body;
        const updateUser = await User.findByIdAndUpdate(
            {_id:userId},
            {
                $set:{
                    name:name,
                    mobile:mobile
                }
            }
        )
        if(updateUser){
            const data={}
            const userData = await User.findOne({_id:userId})
            for(let key in userData.toObject()){
                if(key !== 'password'){
                    data[key] = userData[key]
                }
            }
            res.json({
                data:data
            })
        }
    } catch (error) {
        console.log(error.message);

    }
    
}


const addImage=async(req,res)=>{
    try {
        const image = req.file.filename
        const userId = req.body.userId
        const findUser = await User.findByIdAndUpdate(
            {_id : userId},
            {
                image :image
            }
        )

        let data = {}
        if(findUser){
            const Data = await User.findOne({_id:userId})

            for(let key in Data.toObject()){
                if(key !== 'password'){
                    data[key] = Data[key]
                }
            }
            res.json({
                data:data
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const verifylogout =async(req,res)=>{
console.log("verify logoutt")
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // or 'strict'
            maxAge: 0,
            path: '/'
        });
        
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ status: 'error', message: 'Logout failed' });
    }


}



export {

    registerUser,
    verifyLogin,
    profileEdit,
    addImage,
    verifylogout

}