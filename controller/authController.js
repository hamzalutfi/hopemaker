const user=require("../models/user");
const {sendActivationEmail}=require('../utils/SendEmail');

exports.signup = async (req, res) => {

    try
    {
        const createdUser= await user.create(req.body); //create user from the info in req.body
        const userToken= await createdUser.createActivationToken();//HERE we create the activation token
        await sendActivationEmail({
            email:createdUser.email,
            token:userToken,
        })
        createdUser.save({validateBeforeSave:false});
        res.send("done");
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
}
exports.login=async (req,res)=>{
    try
    {
        const {email,password}=req.body;
        const currentUser=await user.findOne({email}).select("+password status");
        if(!currentUser){
            return res.status(500).send("user not found");
        }
        const correctPassword = currentUser.correctPassword(password, currentUser.password);
        if(!correctPassword){
            return res.status(500).send("wrong password");
        } if(currentUser.status==="inactive"){
            return res.status(500).send("user is inactive");
        }
        res.send("done");

    }
    catch(err){
        
        res.status(500).send(err);
    }
}


