//console.log('npm i express bcryptjs cookie-parser cors helmet joi jsonwebtoken mongoose nodemailer')
const express = require('express')
const { products } = require('./data');
const { default: helmet } = require('helmet');
const cors = require('cors');
const cookieparer = require('cookie-parser');
const { extend } = require('joi');
const app = express();
const { route } = require('./router/authrouter')
const { htmlRoute } = require('./router/htmlrouter')
const  postroute  = require('./router/postrouter')
const {search, itemvalue, idvalue, random} = require('./router/test')
const mongoose = require('mongoose')
app.use(cors());
app.use(helmet());
app.use(cookieparer());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
require('dotenv').config();

mongoose.connect(process.env.Mongo_Url).then(() =>{
    console.log('database connected')
}).catch((err) =>{
    console.log(err)
})


app.use('/api/posts', postroute)
app.use('/api/code', htmlRoute)
app.use('/api/auth', route)
app.get('/search/query',search)
app.get('/random', random)
app.get('/items/:itemvalue', itemvalue)
app.get('/items/id/:idvalue', idvalue)
app.get('/', (req, res) =>{
    res.json(products)
})

app.listen(process.env.PORT, () =>{
    console.log('server is running')
})