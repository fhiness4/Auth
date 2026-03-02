const { string, required } = require('joi')
const mongoose = require('mongoose')

const userschema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name is required'],
        trim: true,
        minlength: [5,'name must be more than 5 letter'],
        lowercase: true
    },
    email:{
        type: String,
        required: [true, 'email is required'],
        trim: true,
        unique: [true, 'email must be unique'],
        minlength: [5,'email must be more than 5 letter'],
        lowercase: true
    },
    password:{
        type: String,
        required:[true, 'password must be provided'],
        trim: true,
        select:false
    },
    verified:{
        type: Boolean,
        default: false
    },
    verificationcode:{
        type: String,
        select: false
    },
        verificationcodevalidation:{
        type: String,
        select: false
    },
        forgotpassword:{
        type: String,
        default: false
    },
    forgotpasswordcodevalidation: {
			type: Number,
			select: false,
		},
         profilepic:{
        type: String,
	    default: "http://res.cloudinary.com/db4x6r4zm/image/upload/v1771752051/obt6hrntfafw9lkilt26.jpg"
    },
},
    {
        timestamps: true
    });


    module.exports = mongoose.model('user', userschema)
