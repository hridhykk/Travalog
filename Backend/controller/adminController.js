import User from "../models/userModel.js";
import generateToken from "../utils/generateWebTokens.js";

const adminLogin = async(req, res) => {
    try {
        const { Email, Password } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
      
        if (adminEmail === Email) {
            if (adminPassword === Password) {
                const token = await generateToken({ email: Email });
                const admin = await User.find({}, {
                    _id: 1,
                    name: 1,
                    email: 1,
                    mobile: 1,
                    is_blocked: 1,
                });
                
                // Setting the cookie with the JWT
                res.cookie('adminjwt', token, {
                    httpOnly: true,                       // Makes cookie inaccessible to JavaScript (XSS protection)
                    secure: process.env.NODE_ENV === 'production',  // Ensures the cookie is sent only over HTTPS in production
                    maxAge: 30 * 24 * 60 * 60 * 1000,     // 30 days expiry
                    path: '/',                            // Cookie is available to all routes
                                    // Prevents CSRF attacks by restricting cross-site sending
                });
                
                res.json({ token: token, userData: admin });
            } else {
                res.json({ status: 'passwordMismatch' });
            }
        } else {
            res.json({ status: "emailMismatch" });
        }
    } catch (error) {
        console.log(error.message);
    }
};


const fetchData = async(req,res)=>{
    try {
        const data =  await User.find({})
        res.json({data:data})
    } catch (error) {
        console.log(error.message);
    }
}

const editUser = async(req,res)=>{
    try {
        console.log("enter controller edit");
       const {name,userId,is_blocked} = req.body
       console.log(name,userId,is_blocked,'in edit user');
       const updateData = {name}
       if(typeof is_blocked !== 'undefined'){
        updateData.is_blocked = is_blocked
       }
       console.log(updateData,"data need upadte");
       const findUser = await User.findOne({_id:userId})
       console.log(findUser,"userFind");
        const updatedUser = await User.updateOne({_id:userId},{$set:updateData})
        console.log(updatedUser,'uoadtaed user');
        console.log(findUser,"userFind after update");
        res.json(updatedUser)
    } catch (error) {
        console.log(error.message);
    }
}

const deleteUser = async(req,res)=>{
    try {
        const id = req.body.userId
        const removeUser = await User.deleteOne({_id:id})
        console.log(removeUser,'user removed');
        res.json(removeUser)
    } catch (error) {
        console.log(error.message);
    }
}


const verifylogout =async(req,res)=>{
    console.log("verify logoutt")
        try {
            res.cookie('adminjwt', '', {
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
    adminLogin,
    fetchData,
    editUser,
    deleteUser,
    verifylogout
}