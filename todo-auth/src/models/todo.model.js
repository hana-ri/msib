const query = require("../config/db.config");
const { multipleColumnSet } = require("../utils/common.utils");

class TodoModel {
    tableName = "todo";

    list = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName};`;

        return await query(sql);
    }

    create = async ({title, description, completed=0}) => {
        const sql = `INSERT INTO ${this.tableName} (title, description, completed) VALUES (?, ?, ?)`;

        const result = await query(sql, [title, description, completed]);

        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const {columnSet, values} = multipleColumnSet(params);
        
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`
        
        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async(id) => {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new TodoModel();