const joi = require('joi');

const signupschema = joi.object({
    email: joi.string().min(6).max(60).required().email(
        {
            tlds : {allow: ['com' , 'net']}
        }
    ),
    password:joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')).messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must include uppercase, lowercase, and number'
    })
});


const signinschema = joi.object({
    email: joi.string().min(6).max(60).required().email(
        {
            tlds : {allow: ['com' , 'net']}
        }
    ),
    password:joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')).messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must include uppercase, lowercase, and number'
    })
})

const acceptcodeschema = joi.object({
    email: joi.string().min(6).max(60).required().email(
        {
            tlds : {allow: ['com' , 'net']}
        }
    ),
    providedcode: joi.number()
});


const changePasswordSchema = joi.object({
	newPassword: joi.string()
		.required()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')),
	oldPassword: joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
});


const acceptFPCodeSchema = joi.object({
	email: joi.string()
		.min(6)
		.max(60)
		.required()
		.email({
			tlds: { allow: ['com', 'net'] },
		}),
	providedCode: joi.number().required(),
	newPassword: joi.string()
		.required()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
});


const createPostSchema = joi.object({
	title: joi.string().min(3).max(60).required(),
	description: joi.string().min(3).max(600).required(),
	userId: joi.string().required(),
});
module.exports = {signupschema, signinschema, acceptcodeschema, changePasswordSchema, acceptFPCodeSchema, createPostSchema}
