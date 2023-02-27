const query = require("../config/db.config");
const { multipleColumnSet } = require("../utils/common.utils");
const Role = require("../utils/userRoles.utils");

class UserModel {
    tableName = "users";
  
    find = async (params = {}) => {
      let sql = `SELECT * FROM ${this.tableName}`;
      
      if (!Object.keys(params).length) {
        return await query(sql);
      }
  
      const { columnSet, values } = multipleColumnSet(params);
      sql += ` WHERE ${columnSet}`;
  
      return await query(sql, [...values]);
    };
  
    findOne = async (params) => {
      const { columnSet, values } = multipleColumnSet(params);
  
      const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;
  
      const result = await query(sql, [...values]);
  
      // return back the frist row (user)
      return result[0];
    };
  
    create = async ({ email, password, role = Role.User, status = 0}) => {
      const sql = `INSERT INTO ${this.tableName} (email, password, role, status) VALUES (?, ?, ?, ?)`;
  
      const result = await query(sql, [ email, password, role, status]);
      
      const affectedRows = result ? result.affectedRows : 0;
  
      return affectedRows;
    };
  
    update = async (params, id) => {
      const { columnSet, values } = multipleColumnSet(params);
  
      const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;
  
      const result = await query(sql, [...values, id]);
  
      return result;
    };
  
    delete = async (id) => {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
  
      const result = await query(sql, [id]);

      const affectedRows = result ? result.affectedRows : 0;
  
      return affectedRows;
    };
  }
  
  module.exports = new UserModel();