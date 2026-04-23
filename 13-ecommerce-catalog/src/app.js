const express=require('express');
const app=express();
app.use(express.json());
app.use('/api/catalog', require('./routes/catalog'));
module.exports=app;