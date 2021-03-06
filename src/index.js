const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./events');
const vendors = require('./vendors');
const forbidden = require('./forbidden');
const winners = require('./winners');
const limit = require('./limit');
const users = require('./users');
const graphicsByUser = require('./graphicsByUser');
const salesByVendor = require('./salesByVendor');


const connection = mysql.createConnection({
  host     : 'remotemysql.com',
  port     : '3306',
  user     : 'YflbgGGuYI',
  password : 'PRVwXgemLr',
  database : 'YflbgGGuYI',
  acquireTimeout: 60000
  //host     : 'localhost',
  //port     : '3306',
  //user     : 'root',
  //password : 'y4545g$Md',
  //database : 'bet'
});

connection.connect();
setInterval(function () {
  connection.query('SELECT 1');
}, 5000);

const port = process.env.PORT || 8080;

const app = express()
  .use(express.static('./dist/bet'))
  .use(cors())
  .use(bodyParser.json())
  .use(events(connection))
  .use(vendors(connection))
  .use(forbidden(connection))
  .use(winners(connection))
  .use(limit(connection))
  .use(users(connection))
  .use(graphicsByUser(connection))
  .use(salesByVendor(connection));

app.get('/*', (req, res) => {
  res.sendFile('index.html',{root: 'dist/bet/'});
});
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

