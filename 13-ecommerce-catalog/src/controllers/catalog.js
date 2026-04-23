const s=require('../services/catalog');
exports.list=(req,res)=>res.json(s.getAll());