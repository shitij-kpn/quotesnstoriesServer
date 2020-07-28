const mysql = require("mysql");
// const util = require("util");

const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9599",
  database: "quotesnstories",
});

pool.connect(function (err) {
  if (!err) {
    console.log("Database is connected");
  } else {
    console.log("Error while connecting with database", err);
  }
});

// pool.query = util.promisify(pool.query);

module.exports = pool;
