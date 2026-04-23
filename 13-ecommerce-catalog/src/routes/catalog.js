const r=require('express').Router();
const c=require('../controllers/catalog');
r.get('/', c.list);
module.exports=r;