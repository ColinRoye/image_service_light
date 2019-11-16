const debug = require("./src/debug");
const db = require("./src/database");

const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
var cors = require('cors');

const app = express()
const args = process.argv;
var port = 3000

require('./src/schema.js');

const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['130.245.170.226'],
  localDataCenter: 'datacenter1'
});

// client.connect()
//   .then(() => console.log('Connected!'));

db.init_cassandra(client)
console.log("test")
//optional port setting
if(args.includes("-p")){
     port = args[args.indexOf("-p")+1];
}

app.use(bodyParser());


app.use(cookieParser());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// require('./src/schema');
app.use(require('./src/routes'));




app.listen(port, () => console.log(`Example app listening on port ${port}!`))
