//jshint esversion: 6
var mysql = require('mysql');


var pool = mysql.createPool({
  connectionLimit:4,
  host: "bc3vatll6lwvcqhmplbf-mysql.services.clever-cloud.com",
  user: "u9islwucwtaazh8e",
  password: "jLJAOVvg0VhwViyY7dJv",
  database:"bc3vatll6lwvcqhmplbf"
});

pool.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool;