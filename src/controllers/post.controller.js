const express=require("express");

const Post=require("../models/post.model");

const authenticate=require("../middleware/authenticate");

const router = express.Router();


//If user is not authenticated he will not go inside below mentioned async function

router.post("/",authenticate,async(req,res)=>{ //Create post only when user is authenticated
    try{
        const user = req.user;
        //console.log(user);
        const post=await Post.create({
            title:req.body.title,
            body:req.body.body,
            user:user.user._id
        });
        return res.status(201).json({post});
    }
    catch(e){
        return res.status(500).json({status:"failed",message:e.message});
    }   
})


router.get("/",authenticate,async(req,res)=>{ //Get all posts only if user is authenticated
    try{
        const posts=await Post.find().lean().exec();
        return res.status(201).json({posts});
    }
    catch(e){
        return res.status(500).json({status:"failed",message:e.message});
    }   
})


module.exports=router;