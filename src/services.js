const debug = require("./debug");
const env = require("./env");
const db = require("./database");
const uuid = require("uuid/v1")

//export db agnostic services
module.exports={
     deposit: async (filename, contents, res, username)=>{
          debug.log(username)
          return db.deposit(filename, contents, res, username);
     },
     retrieve: async(filename, res)=>{
          return db.retrieve(filename, res)
     },
     delete: async(filename, res)=>{
          return db.delete(filename, res)
     },
     getUsed: async(filename, res, username)=>{
          return db.getUsed(filename, res, username)
     },
     setUsed: async(filename, res)=>{
          return  db.setUsed(filename, res)
     }
}
