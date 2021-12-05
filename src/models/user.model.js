const bcrypt=require("bcrypt");
//
const {Schema,model}=require("mongoose");

const userSchema =new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
},
{
    versionKey:false,
    timestamps:true,
})

//Below line is a HOOK used in authentication purposes, and acts as a middleware. It will first perform the code written in it and only then it will proceed to saving the user.

userSchema.pre("save", function (next) { // This code runs for both Create and Update as in both cases we save the document.
    // if password aint changed, means no need to hash it again
    if(! this.isModified("password")) return next();

    // if password is changed, means we need to hash the password
        const hash= bcrypt.hashSync(this.password,10);
            this.password=hash;
            return next(); 
});


//To compare password For Login
userSchema.methods.checkPassword = function (password){
    return new Promise((resolve,reject)=>{
 
        bcrypt.compare(password, this.password, function(err,same){ // password is password provided by user & this.password is password from database
                if(err) return reject(err);

                return resolve(same);
        });
    });
};

module.exports= model("user",userSchema); //users