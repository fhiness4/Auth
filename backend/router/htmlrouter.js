const express = require('express');
const htmlRoute = express.Router();
const {addfile, gethtml, deletehtml} = require('../controllers/htmlcontroller')

htmlRoute.post('/add-html', addfile)
htmlRoute.get('/getuser-html', gethtml)
htmlRoute.delete('/delete-html', deletehtml)

module.exports = {htmlRoute}