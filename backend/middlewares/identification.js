const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const identifier = (req, res, next) => {
let token;
if (req.headers.client === 'not-browser') {
token = req.headers.authorization;
} else {
token = req.cookies['Authorization'];
}
if (!token) {
return res.status(403).json({ success: false, message: 'Unauthorized' });
}

try {
const userToken = token.split(' ')[1];
const jwtVerified = jwt.verify(userToken, process.env.secret_token);
if (jwtVerified) {
req.user = jwtVerified;
next();
} else {
throw new Error('error in the token');
}
} catch (error) {
console.log(error);
return res.status(403).json({ success: false, message: 'Invalid token' });

}
};

module.exports ={ identifier}