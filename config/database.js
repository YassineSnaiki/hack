// config/database.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "pass24ch",
  database : "users_db",
  multipleStatements: true,
});

module.exports = pool.promise();
