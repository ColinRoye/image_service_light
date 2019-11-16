const env = require("./env");
const debug = require("./debug");
var cassandra = require('cassandra-driver');
var client;

/*
 * GET home page.
 */
module.exports={
     init_cassandra: async (client_in)=>{
     	  client = client_in
	      client_in.connect()
     		.then(function () {
     			const query = "CREATE KEYSPACE IF NOT EXISTS hw6 WITH replication =" +
     			  "{'class': 'SimpleStrategy', 'replication_factor': '1' }";
     			return client.execute(query);
     		})
     		.then(function () {
          debug.log("making table")
     			const query = "CREATE TABLE IF NOT EXISTS hw6.imgs3" +
     				" (filename ascii, contents blob, used ascii, username ascii, PRIMARY KEY(filename))";
     			return client.execute(query);
     		})
     		.then(function () {
     			return client.metadata.getTable('hw6', 'imgs3');
     		})
     		.then(function (table) {
     			console.log('Table information');
     			console.log('- Name: %s', table.name);
     			console.log('- Columns:', table.columns);

     		})
     		.catch(function (err) {
     			console.error('There was an error', err);
     			res.status(404).send({msg: err});
     			return client.shutdown();
     		});

    },
    getUsed: async(filename, res, username)=>{
       let ret = {};
        const query = 'SELECT * FROM hw6.imgs3 WHERE filename = ?';
        return client.execute(query, [ filename ]).then((result)=>{
          debug.log("usernames")
          debug.log(username)
          debug.log(JSON.stringify(result.rows[0].username))
            if(result.rows[0].used){
              if(result.rows[0].username === username){
                res.send({used:result.rows[0].used});
              }else{
                res.send({used:"-2"})
              }
            }else{
              res.send({used:"-1"});
            }
        }).catch((err)=>{
             ret = env.statusError;
             ret.error = err;
             res.send(ret);
        });
    },
    setUsed: async(filename, res)=>{
        let ret = {};
        const query = 'UPDATE hw6.imgs3 SET used = ? WHERE filename = ?';
        return client.execute(query, [ '1' , filename ]).then((result)=>{
            res.send(result);
        }).catch((err)=>{
            console.log(err)
            ret = env.statusError;
            ret.error = err;
            res.send(ret);
        });
    },
    deposit: async(filename, contents, res, username)=>{
	        contents = JSON.stringify(contents);
          const query = "INSERT INTO \"hw6\".\"imgs3\" (filename, contents, used, username) VALUES (?, ?, ?, ?)";
          let ret = {};
          debug.log("USERNAME: " + username)
          return client.execute(query, [ filename, contents, '0', username ]).then((resp)=>{
                ret = env.statusOk;
                ret.id = filename;
                res.send(ret);
          }).catch((err)=>{
                ret = env.statusError;
                ret.error = err;
                res.send(ret);
          });
    },
    retrieve: async(filename, res)=>{
        let ret = {};
        const query = 'SELECT contents FROM hw6.imgs3 WHERE filename = ?';
        return client.execute(query, [ filename ]).then((result)=>{
			       res.setHeader("Content-Type" ,   JSON.parse(result.rows[0].contents).mimetype)
			       res.send(new Buffer(JSON.parse(result.rows[0].contents).buffer.data));
  		  }).catch((err)=>{
             ret = env.statusError;
             res.status("400").send(env.statusError);
        });
    },
    delete: async(filename, res)=>{
         const query = 'DELETE contents FROM hw6.imgs3 WHERE filename = ?';
         return client.execute(query, [ filename ]).then((result)=>{
            res.send(env.statusOk);
         }).catch((err)=>{
            res.send(env.statusError);
         });
    }


}
