const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());
var dev_db_url = 'mongodb+srv://AnilBameta:AnilgotAtlas@cluster0.hw2so.mongodb.net/SignUpData?retryWrites=true&w=majority'
var mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB).then (()=>
    console.log("Connection Success")
).catch((err)=>console.log(err));
mongoose.Promise = global.Promise;

 app.use(express.static('public'));
 app.use(express.json());
 app.use('/api',require('./routes/api'));
 app.use((err,req,res,next) => {
    res.status(400).send({error: err.message});
    res.status(401).send({error: err.message});
    res.status(500).send({error: err.message});
 });
 app.listen(process.env.PORT || 4000, () => {
    console.log('Ready to go');
 });
 