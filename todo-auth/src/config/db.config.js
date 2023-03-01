const dotenv = require("dotenv");
const mysql = require("mysql2");

dotenv.config();

class DBConnection {
  constructor() {
    this.db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    this.checkConnection();
  }

  checkConnection() {
    this.db.getConnection((err, connection) => {
      if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          console.error("[Status] Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
          console.error("[Status] Database has too many connections.");
        }
        if (err.code === "ECONNREFUSED") {
          console.error("[Status] Database connectiin was refused.");
        }
      }
      if (connection) {
        connection.release();
        console.log("[Status] Database connection realease");
      }
      return;
    });
  }

  query = async (sql, values) => {
    return new Promise((resolve, reject) => {
      const callback = (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      };
      // execute will internally call prepare and query
      this.db.execute(sql, values, callback);
    }).catch((err) => {
      // console.log(err);
      const mysqlErrorList = Object.keys(err);

      // convert mysql errors which in the mysqlErrorList list to http status code
      err.status = mysqlErrorList.includes(err.code)
        ? err[err.code]
        : err.status;

      throw err;
    });
  };
}

module.exports = new DBConnection().query;
