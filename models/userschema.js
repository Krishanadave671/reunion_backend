const mongoose = require("mongoose")
const postschema = require("../models/postschema"); 

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true,
      },
    
    followers: {
        type: Array,
        default: [],
        },
    followings: {
        type: Array,
        default: [],
        },
    

    email : {
        type : String,
        trim : true , 
        required : true ,
        unique : true, 
        validate : {
            validator : (value) => {
                const re =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
              return value.match(re);
            }, 
            message : "Please enter a valid email address"
    }
} ,
    password : {
        type : String,
        required : true,
        minlength : 6,
        trim : true,
        validate : {
            validator : (value) => {
                return !value.toLowerCase().includes("password");
            },
            message : "Password cannot contain 'password'"
        }
    }, 
    posts : [postschema],
})

const User = mongoose.model("User", userSchema);
module.exports = User;