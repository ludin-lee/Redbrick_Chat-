const {server} =require('./socket')
const express =  require('express');
const app=express();

app.use('/',express.static('statics'))


module.exports=app;