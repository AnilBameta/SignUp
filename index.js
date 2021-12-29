const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.connect('mongodb+srv://AnilBameta:AnilgotAtlas@cluster0.hw2so.mongodb.net/SignUpData?retryWrites=true&w=majority').then (()=>
    console.log("Connection Success")
).catch((err)=>console.log(err));
mongoose.Promise = global.Promise;
 app.use(express.static('public'));
 app.use(express.json());
 app.use('/api',require('./routes/api'));
 app.use(function(err,req,res,next){
    res.status(400).send({error: err.message});
    res.status(401).send({error: err.message});
    res.status(500).send({error: err.message});
 });
 app.listen(process.env.port || 4000, function(){
    console.log('Ready to go');
 });
 