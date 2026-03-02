// templates/emailTemplate.js

const emailTemplate = (email, code) => {
    return `
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
            
            <p>© 2026 DEVIO. All rights reserved.</p>
            
            
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
</html>`;
};

module.exports = emailTemplate;