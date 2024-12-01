const express = require('express');
const app=express();
const user=require('./routes/user');
app.use(express.json());
app.use('/authr',user)
module.exports=app;