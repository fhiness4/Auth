const jwt = require('jsonwebtoken');
const { signupschema, signinschema, acceptcodeschema, changePasswordSchema, acceptFPCodeSchema} = require('../middlewares/validator');
const user  = require('../models/usersmodel');
const {transport}  = require('../middlewares/sendmail');
const { dohash, dohashvalidation, hmacprocess } = require('../util/hashing');
const {emailTemplate} = require('../util/htmltemplate');
const { exist } = require('joi');

const signup = async (req, res) => {
    const {name, email, password } = req.body;
    
    try {
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const { error, value } = signupschema.validate({ email, password });
        if (error) {
            return res.status(400).json({   
                success: false,
                message: error.details[0].message
            });
        }

        // Check if user already exists
        const existinguser = await user.findOne({ email });
        if (existinguser) {
            return res.status(409).json({  // Changed to 409 Conflict for existing resources
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const hashpassword = await dohash(password, 12);

        // Create new user
        const newuser = new user({
            name,
            email,
            password: hashpassword
        });

        const result = await newuser.save();
        
        // Remove password from response
        result.password = undefined;
        
        res.status(201).json({
            success: true,
            message: `Account created successfully`,
            data: {
                email: result.email,
                id: result._id  // Include user ID in response
            },
            user: {
				...result._doc,
			},
        });

    } catch (error) {
        console.error('Signup error:', error);  // Better error logging
        
        // Handle specific MongoDB errors
        if (error.name === 'MongoError' || error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Database error occurred'
            });
        }
        
        // Generic server error
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

//sighin function
const signin = async(req, res) =>{
  const{email, password} = req.body
  try {
    const {error, value} = signinschema.validate({email, password});
    if (error) {
         return res.status(400).json({ 
                success: false,
                message: error.details[0].message
            });
    }

    const existinguser = await user.findOne({email}).select('+password');
    if (!existinguser) {
         return res.status(409).json({  // Changed to 409 Conflict for existing resources
                success: false,
                message: 'user do not exist'
            });
    }
   const result = await dohashvalidation(password, existinguser.password);
   if (!result) {
     return res.status(409).json({  // Changed to 409 Conflict for existing resources
                success: false,
                message: 'invalid credentials'
            });
   }

   const token  = jwt.sign({
    userId: existinguser._id,
    email: existinguser.email,
    verified: existinguser.verified
   },
   process.env.secret_token,{
    expiresIn:'8h'
   }
);

res.cookie('Authorization', 'Bearer' + token ,
     {expires: new Date(Date.now() + 8 * 3600000),
     httponly: process.env.NODE_ENV ==='production',
     secure: process.env.NODE_ENV ==='production' }).json({
        success: true,
        token,
        message:'logged in succesfully',
        user:{...existinguser._doc,
            password: undefined}
        
        
        
     })
  } catch (error) {
    console.log(error)
  }
}

// signout functionality
const signout = async (req, res) =>{
 res.clearCookie('Authorization').status(200).json({
    success: true,
    message: 'logged out successfully'
 })
};

// send code 
const sendverification =  async (req, res) =>{
    const {email} = req.body;
    console.log(req.body);
    try {
      // Check if user already exists
        const existinguser = await user.findOne({ email });
        if (!existinguser) {
            return res.status(401).json({  
                success: false,
                message: 'User not found'
            });
        }
         if (existinguser.verified) {
            return res.status(400).json({  // Changed to 409 Conflict for existing resources
                success: false,
                message: 'you are already verified'
            });
        };


        const codevalue =  Math.floor(Math.random() * 90000 + 10000).toString();
        // console.log(codevalue)
    let info = await transport.sendMail({
        from: "fhiness434@gmail.com",
        to: existinguser.email,
        subject: 'verification code',
        html:  `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - Dark Theme</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #e0e0e0;
            background-color: #121212;
        }
        
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #1e1e1e;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            border: 1px solid #333;
        }
        
        .header {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            padding: 30px 20px;
            text-align: center;
            border-bottom: 1px solid #333;
        }
        
        .header h1 {
            color: #bb86fc;
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header p {
            color: #b0b0b0;
            font-size: 16px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #e0e0e0;
            margin-bottom: 20px;
        }
        
        .greeting strong {
            color: #bb86fc;
        }
        
        .message {
            color: #b0b0b0;
            margin-bottom: 30px;
        }
        
        .verification-code {
            background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 1px solid #333;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .code-label {
            color: #888;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
        }
        
        .code {
            font-size: 52px;
            font-weight: 700;
            letter-spacing: 10px;
            color: #bb86fc;
            font-family: 'Courier New', monospace;
            background: #1a1a1a;
            padding: 20px 25px;
            border-radius: 8px;
            display: inline-block;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
            border: 1px solid #333;
            text-shadow: 0 0 10px rgba(187, 134, 252, 0.3);
        }
        
        .expiry {
            text-align: center;
            margin: 30px 0;
            padding: 15px;
            background: #2d2d2d;
            border: 1px solid #444;
            border-radius: 8px;
            color: #ffb74d;
        }
        
        .expiry strong {
            color: #ffa726;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .button {
            display: inline-block;
            padding: 14px 35px;
            background: linear-gradient(135deg, #bb86fc 0%, #9b6bcc 100%);
            color: #121212;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        .button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(187, 134, 252, 0.2);
        }
        
        .security-notice {
            margin-top: 30px;
            padding: 15px;
            background: #2d2d2d;
            border-left: 4px solid #bb86fc;
            border-radius: 4px;
            color: #b0b0b0;
            font-size: 14px;
        }
        
        .security-notice strong {
            color: #bb86fc;
        }
        
        .footer {
            padding: 30px 20px;
            text-align: center;
            background: #1a1a1a;
            border-top: 1px solid #333;
        }
        
        .footer p {
            color: #888;
            font-size: 14px;
            margin: 8px 0;
        }
        
        .company-name {
            color: #bb86fc;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 12px;
            color: #888;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .social-links a:hover {
            color: #bb86fc;
        }
        
        .divider {
            color: #444;
            margin: 0 5px;
        }
        
        .alt-link {
            margin-top: 20px;
            padding: 15px;
            background: #1a1a1a;
            border-radius: 8px;
            font-size: 12px;
            color: #666;
            word-break: break-all;
        }
        
        .alt-link span {
            color: #bb86fc;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .code {
                font-size: 36px;
                letter-spacing: 5px;
                padding: 15px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🔐 Verify Your Email</h1>
            <p>Complete your registration with this verification code</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello <strong>${existinguser.email}</strong>,
            </div>
            
            <div class="message">
                Thank you for signing up! To ensure the security of your account, please verify your email address by entering the following verification code:
            </div>
            
            <!-- Verification Code Section -->
            <div class="verification-code">
                <div class="code-label">Verification Code</div>
                <div class="code">${codevalue}</div>
            </div>
            
            <!-- Expiry Information -->
            <div class="expiry">
                ⏰ This code will expire in <strong>5 mins</strong>
            </div>
            

            
            <!-- Security Notice -->
            <div class="security-notice">
                <strong>⚠️ Security Alert:</strong> Never share this verification code with anyone. Our team will never ask for this code.
            </div>
            
            <div style="margin-top: 20px; color: #888; font-size: 14px;">
                <p>If you didn't create an account with us, please ignore this email .</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="company-name">DEVIO</div>
            
            <p>© ${new Date().getFullYear()} DEVIO. All rights reserved.</p>
            
            
            <div class="social-links">

                <a href="https://www.tiktok.com/@byte__bandit?_r=1&_t=ZS-94MBo7VRMUy">📷 TikTok</a>
                <span class="divider">•</span>
                <a href="https://www.linkedin.com/in/odebunmi-quadri-094878368">💼 LinkedIn</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px;">
                This is an automated message, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>`
    });

    if (info.accepted[0] === existinguser.email) {
        hashedcodevalue = hmacprocess(codevalue, process.env.hmac_verification_secret);
        existinguser.verificationcode = hashedcodevalue;
        existinguser.verificationcodevalidation = Date.now();
        await existinguser.save();
        return res.status(200).json({
            success: true,
            message: 'code sent!',
            user: {...existinguser._doc,
                password: undefined}
        })
    };
    res.status(200).json({
            success: true,
            message: 'code sent failed !'
        })

    } catch (error) {
        console.log(error)
    }
}


// verify code
const verifyverificationCode =  async (req, res) => {
    const {email , providedcode } = req.body;
    try {
        
        const { error, value } = acceptcodeschema.validate({email , providedcode});
        if (error) {
            return res.status(400).json({   
                success: false,
                message: error.details[0].message
            });
        }

        const codevalue = providedcode.toString();
        const existinguser = await user.findOne({email}).select('+verificationcode +verificationcodevalidation')
        if (!existinguser) {
         return res.status(409).json({  // Changed to 409 Conflict for existing resources
                success: false,
                message: 'user do not exist'
            });
    }
    if (existinguser.verified) {
         return res.status(409).json({  // Changed to 409 Conflict for existing resources
                success: false,
                message: 'You are alreadly verified'
            });
    }
if (
			!existinguser.verificationcode ||
			!existinguser.verificationcodevalidation
		) {
			return res
				.status(400)
				.json({ success: false, message: 'something is wrong with the code!' });
		}



    if (Date.now() - existinguser.verificationcodevalidation > 5* 60* 1000) {
          return res.status(409).json({  // Changed to 409 Conflict for existing resources
                success: false,
                message: "Code has been expired"
            });
    }

     const  hashedcodevalue = hmacprocess(codevalue, process.env.hmac_verification_secret);
     if (hashedcodevalue === existinguser.verificationcode) {
        existinguser.verified = true;
        existinguser.verificationcode = undefined;
        existinguser.verificationcodevalidation = undefined;

        await existinguser.save();
     return res.status(209).json({  // Changed to 409 Conflict for existing resources
                success: true,
                message: "Your account has been verified"
            });
        
     }

      return res.status(409).json({  // Changed to 409 Conflict for existing resources
                success: false,
                message: "unexpected error"
            });
    } catch (error) {
        console.log(error)
    }
}

// change pasword

const changePassword = async (req, res) => {
	const { userId, verified } = req.user;
	const { oldPassword, newPassword } = req.body;
	try {
		const { error, value } = changePasswordSchema.validate({
			oldPassword,
			newPassword,
		});
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}
		// if (!verified) {
		// 	return res
		// 		.status(401)
		// 		.json({ success: false, message: 'You are not verified user!' });
		// }
		const existinguser = await user.findOne({ _id: userId }).select(
			'+password'
		);
		if (!existinguser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' });
		}
		const result = await dohashvalidation(oldPassword, existinguser.password);
		if (!result) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials!' });
		}
		const hashedPassword = await dohash(newPassword, 12);
		existinguser.password = hashedPassword;
		await existinguser.save();
		return res
			.status(200)
			.json({ success: true, message: 'Password updated!!' });
	} catch (error) {
		console.log(error);
	}
};
//send forgot password code
const sendforgotpassword = async (req, res) => {
	const { email } = req.body;
	try {
		const existinguser = await user.findOne({ email });
		if (!existinguser) {
			return res
				.status(404)
				.json({ success: false, message: 'User does not exists!' });
		}

		const codeValue = Math.floor(Math.random() * 1000000).toString();
		// console.log(codeValue)
		let info = await transport.sendMail({
			from: "fhiness434@gmail.com",
			to: existinguser.email,
			subject: 'Forgot password code',
			html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - Dark Theme</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #e0e0e0;
            background-color: #121212;
        }
        
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #1e1e1e;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            border: 1px solid #333;
        }
        
        .header {
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            padding: 30px 20px;
            text-align: center;
            border-bottom: 1px solid #333;
        }
        
        .header h1 {
            color: #bb86fc;
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header p {
            color: #b0b0b0;
            font-size: 16px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #e0e0e0;
            margin-bottom: 20px;
        }
        
        .greeting strong {
            color: #bb86fc;
        }
        
        .message {
            color: #b0b0b0;
            margin-bottom: 30px;
        }
        
        .verification-code {
            background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 1px solid #333;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .code-label {
            color: #888;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
        }
        
        .code {
            font-size: 52px;
            font-weight: 700;
            letter-spacing: 10px;
            color: #bb86fc;
            font-family: 'Courier New', monospace;
            background: #1a1a1a;
            padding: 20px 25px;
            border-radius: 8px;
            display: inline-block;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
            border: 1px solid #333;
            text-shadow: 0 0 10px rgba(187, 134, 252, 0.3);
        }
        
        .expiry {
            text-align: center;
            margin: 30px 0;
            padding: 15px;
            background: #2d2d2d;
            border: 1px solid #444;
            border-radius: 8px;
            color: #ffb74d;
        }
        
        .expiry strong {
            color: #ffa726;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .button {
            display: inline-block;
            padding: 14px 35px;
            background: linear-gradient(135deg, #bb86fc 0%, #9b6bcc 100%);
            color: #121212;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        .button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(187, 134, 252, 0.2);
        }
        
        .security-notice {
            margin-top: 30px;
            padding: 15px;
            background: #2d2d2d;
            border-left: 4px solid #bb86fc;
            border-radius: 4px;
            color: #b0b0b0;
            font-size: 14px;
        }
        
        .security-notice strong {
            color: #bb86fc;
        }
        
        .footer {
            padding: 30px 20px;
            text-align: center;
            background: #1a1a1a;
            border-top: 1px solid #333;
        }
        
        .footer p {
            color: #888;
            font-size: 14px;
            margin: 8px 0;
        }
        
        .company-name {
            color: #bb86fc;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 12px;
            color: #888;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .social-links a:hover {
            color: #bb86fc;
        }
        
        .divider {
            color: #444;
            margin: 0 5px;
        }
        
        .alt-link {
            margin-top: 20px;
            padding: 15px;
            background: #1a1a1a;
            border-radius: 8px;
            font-size: 12px;
            color: #666;
            word-break: break-all;
        }
        
        .alt-link span {
            color: #bb86fc;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .code {
                font-size: 36px;
                letter-spacing: 5px;
                padding: 15px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🔐 Verify Forgot password Code</h1>

        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello <strong>${existinguser.email}</strong>,
            </div>
            
            <div class="message">
                You request a CODE for forget password. To ensure the security of your account, please verify your email address by entering the following verification code:
            </div>
            
            <!-- Verification Code Section -->
            <div class="verification-code">
                <div class="code-label">Verification Code</div>
                <div class="code">${codeValue}</div>
            </div>
            
            <!-- Expiry Information -->
            <div class="expiry">
                ⏰ This code will expire in <strong>5 mins</strong>
            </div>
            

            
            <!-- Security Notice -->
            <div class="security-notice">
                <strong>⚠️ Security Alert:</strong> Never share this verification code with anyone. Our team will never ask for this code.
            </div>
            
            <div style="margin-top: 20px; color: #888; font-size: 14px;">
                <p>If you didn't create an account with us, please ignore this email .</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="company-name">DEVIO</div>
            
            <p>© ${new Date().getFullYear()} DEVIO. All rights reserved.</p>
            
            
            <div class="social-links">

                <a href="https://www.tiktok.com/@byte__bandit?_r=1&_t=ZS-94MBo7VRMUy">📷 TikTok</a>
                <span class="divider">•</span>
                <a href="https://www.linkedin.com/in/odebunmi-quadri-094878368">💼 LinkedIn</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px;">
                This is an automated message, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>`,
		});

		if (info.accepted[0] === existinguser.email) {
			const hashedCodeValue = hmacprocess(
				codeValue,
				process.env.hmac_verification_secret
			);
			existinguser.forgotpassword = hashedCodeValue;
			existinguser.forgotpasswordcodevalidation = Date.now();
			await existinguser.save();
			return res.status(200).json({ success: true, message: 'Code sent!', user: {...existinguser._doc,
                password: undefined} });
		}
		res.status(400).json({ success: false, 
            message: 'Code sent failed!'

         });
	} catch (error) {
		console.log(error);
	}
};
// verify forgot password
const verifyforgotpasswordcode = async (req, res) => {
	const { email, providedCode, newPassword } = req.body;
	try {
		const { error, value } = acceptFPCodeSchema.validate({
			email,
			providedCode,
			newPassword,
		});
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		const codeValue = providedCode.toString();
		const existinguser = await user.findOne({ email }).select(
			'+forgotpassword +forgotpasswordcodevalidation'
		);

		if (!existinguser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' });
		}

		if (
			!existinguser.forgotpassword ||
			!existinguser.forgotpasswordcodevalidation
		) {
			return res
				.status(400)
				.json({ success: false, message: 'something is wrong with the code!' });
		}

		if (
			Date.now() - existinguser.forgotpasswordcodevalidation >
			5 * 60 * 1000
		) {
			return res
				.status(400)
				.json({ success: false, message: 'code has been expired!' });
		}

		const hashedCodeValue = hmacprocess(
			codeValue,
			process.env.hmac_verification_secret
		);

		if (hashedCodeValue === existinguser.forgotpassword) {
			const hashedPassword = await dohash(newPassword, 12);
			existinguser.password = hashedPassword;
			existinguser.forgotPassword = undefined;
			existinguser.forgotpasswordcodevalidation = undefined;
			await existinguser.save();
			return res
				.status(200)
				.json({ success: true, message: 'Password updated!!' });
		}
		return res
			.status(400)
			.json({ success: false, message: 'unexpected occured!!' });
	} catch (error) {
		console.log(error);
	}
};

// upload profile pic
const uploadpic = async (req, res)=>{
    const {email, url} = req.body;
    try {
        const existinguser = await user.findOne({ email });
		if (!existinguser) {
			return res
				.status(404)
				.json({ success: false, message: 'User does not exists!' });
		}

        if(existinguser){
            existinguser.profilepic = url;
            await existinguser.save()
        return res.status(200).json({ success: true, message: 'image uploaded', user: {...existinguser._doc,
                password: undefined} });
		};

		res.status(400).json({ success: false, 
            message: 'image upload failed'

         });


    } catch (error) {
       console.log(error) 
    }
};


// get user data
const getuserdata = async (req, res)=>{
    const {email} = req.body;
    try {
        const existinguser = await user.findOne({ email });
		if (!existinguser) {
			return res
				.status(404)
				.json({ success: false, message: 'User does not exists!' });
		}

        if(existinguser){
            return res.status(200).json({ success: true, message: 'user data retrieved', user: {...existinguser._doc,
                password: undefined} });
		};

		res.status(400).json({ success: false, 
            message: 'user data retrieval failed'

         });


    } catch (error) {
       console.log(error) 
    }
}



module.exports = { signup, signin , signout, sendverification, verifyverificationCode, changePassword, sendforgotpassword, verifyforgotpasswordcode, uploadpic, getuserdata};
