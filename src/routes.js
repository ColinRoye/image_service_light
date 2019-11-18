const express = require("express");
const app = express();
const router = require("express").Router();
const debug = require("./debug");
const env = require("./env");
const services = require("./services");
const morgan = require("morgan");
const multer = require('multer');
const upload = multer();
const shortid = require('shortid');

router.post('/addmedia', upload.single('content'), async (req, res, next)=>{
  let ret;
  if(req.cookies["auth"]){
    let id = shortid.generate();
    debug.log(req.cookies["auth"])
    ret = await services.deposit(id, req.file,res, req.cookies["auth"]);
    // if(ret.status == env.statusError.status){
    //   ret.error = "anything"
    // }
  }else{
     ret = env.statusError;
     ret.error = "not authorized";
     res.send(ret);

  }


});
router.get('/media/:id', async (req, res, next)=>{
     console.log("GET MEDIA: " + JSON.stringify(req.body));
     let filename = req.params.id
     console.log(filename);
     let ret = services.retrieve(filename,res);
});
router.delete('/media/:id', async (req, res, next)=>{
     
//     console.log("DEL MEDIA COOKIE: " + req.cookies['auth']);
     let filename = req.params.id
     console.log(filename);
     let ret = services.delete(filename,res);
});
router.get('/used/:id/:username', async (req, res, next)=>{
      debug.log("madeit to get");      
      let filename = req.params.id
      console.log(filename);
      let ret = services.getUsed(filename,res, req.params.username);

});
router.post('/used/:id', async (req, res, next)=>{
     debug.log("madeit to post");     
     let filename = req.params.id
     console.log(filename);
     let ret = services.setUsed(filename,res);
});

module.exports = router
