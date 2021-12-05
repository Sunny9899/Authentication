//AUTHENTICATION ASSIGNMENT//

//User can login after only he's signed up. Without signup, user can't login and simultaneously can't either create or view posts.

//Validations for name and email and password at signup & email and password at signin

//Creation and Accessing the posts only when user is authenticated with the help of bearer token

const express=require("express");

const {register,login} =require("./controllers/auth.controller");

const postController =require("./controllers/post.controller");

const { body } = require('express-validator');

const app=express();

app.use(express.json());


app.post("/register",
body("name").isLength({min:4, max:20}).withMessage("Name length minreqd:4 maxreqd:20"), // Validators
body("email").isEmail().withMessage("Invalid Email Format"), // Validators
body("password").isLength({min:4}).withMessage("Password length too short"), // Validators
register //Register
);


app.post("/login",
body("email").isEmail().withMessage("Invalid Email Format"), // Validators
body("password").isLength({min:4}).withMessage("Password length too short"), // Validators
login//Login
); 

app.use("/posts",postController);

module.exports=app;

