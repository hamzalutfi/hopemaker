const express = require('express');
const app=express();
const need=require('./routes/needs');
const user=require('./routes/user');
app.use(express.json());
app.use('/auth',user)
app.use('/needs',need)
module.exports=app;