require("dotenv").config();

const jwt= require("jsonwebtoken");

const User= require("../models/user.model");

const newToken = (user) =>{
    return jwt.sign({user:user},process.env.JWT_ACCESS_KEY);
};

const { validationResult } = require('express-validator');



const register =async(req,res)=>{
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newErrors=errors.array().map(err=>err.msg)
      return res.status(400).json({ errors: newErrors });
    }     

    try{

    //check if email provided already exists or not
    let user= await User.findOne({email:req.body.email}).lean().exec();

    // if it already exists, throw an error
    if(user) return res.status(400).json({status:"failed", message:"Please provide different email"});


    // else we will create the user  &  then we will hash the password as plaintext password is harmful
    user = await User.create(req.body); //Hashing done at user.model


    //we will create a token (stateless token)
    const token = newToken(user);

    //Return user and token
    res.status(201).json({user,token});    
    
}
    catch(e){
        return res.status(500).json({status:"failed", message:e.message});
    }



} //User Register 

const login = async(req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newErrors=errors.array().map(err=>err.msg)
      return res.status(400).json({ errors: newErrors });
    }      
    
    try{
    // check if email address provided already exists or not
    let user= await User.findOne({email:req.body.email});
    
    // if it does not exist, throw an error
    if(!user) return res.status(400).json({status:"failed", message:"Please provide correct email and password"});


    // else we match the password (in user model)
    const match = await user.checkPassword(req.body.password);

    //if not match then throw error
    if(!match) return res.status(400).json({status:"failed", message:"Please provide correct email and password"});

    // if it matches create token
    const token = newToken(user);

    // return token and user
    res.status(201).json({user,token});    

}
    catch(e){
        return res.status(500).json({status:"failed", message:e.message});
    }    
} //User log in

module.exports={register,login};