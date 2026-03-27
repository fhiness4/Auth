const express = require('express');
const htmlRoute = express.Router();
const {addfile, gethtml, deletehtml, getsinglehtml} = require('../controllers/htmlcontroller')

htmlRoute.post('/add-html', addfile)
htmlRoute.get('/getuser-html', gethtml)
htmlRoute.get('/getsingle-html', getsinglehtml)
htmlRoute.delete('/delete-html', deletehtml)

module.exports = {htmlRoute}