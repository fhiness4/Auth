const express = require('express');
const route = express.Router();
const {identifier} = require('../middlewares/identification')
const {signup, signin, signout, sendverification, verifyverificationCode, changePassword, sendforgotpassword, verifyforgotpasswordcode, uploadpic, getuserdata} = require('../controllers/authcontroller');
const {postdata} = require('../controllers/testpost');

route.post('/post',postdata);
route.post('/signup', signup)
route.post('/signin', signin)
route.post('/signout',identifier , signout);
route.post('/upload-img',identifier , uploadpic);
route.post('/get-user-data' , getuserdata);
route.patch('/send-code',sendverification)
route.patch('/verify-send-code', verifyverificationCode);
route.patch('/changepassword',identifier, changePassword);
route.patch('/send-forgot-code', sendforgotpassword);
route.patch('/verify-forgot-code', verifyforgotpasswordcode);


module.exports = {route}