// config/database.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "admin",
  multipleStatements: true,
});

module.exports = pool.promise();
