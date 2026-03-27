const express = require('express');
const profileRoute = express.Router();
const {getprofile, updateprofile} = require('../controllers/profilecontroller')

profileRoute.post('/update', updateprofile)
profileRoute.get('/get', getprofile)


module.exports = {profileRoute}