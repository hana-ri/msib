const TodoModel = require("../models/todo.model")
const HttpException = require("../utils/HttpException.utils")


class TodoController {
    getListTodo = async (req, res, next) => {
        let todoList = await TodoModel.list();

        if(!todoList.length) {
            throw new HttpException(404, "Todo list not found");
        }

        res.status(200).send(todoList);
    }

    createTodo = async (req, res, next) => {
        const result = await TodoModel.create(req.body);

        if(!result) {
            throw new HttpException(500, "Something wrong while create todo");
        }

        res.status(201).send("Todo was added!");
    }

    updateTodo = async (req, res, next) => {
        const restOfUpdates = req.body;
        const result = await TodoModel.update(restOfUpdates, req.params.id);

        if(!result) {
            throw new HttpException(500, "Something wrong while update todo");
        }

        const { affectedRows, changeRows, info } = result;


        const message = !affectedRows
        ? "Todo not found"
        : affectedRows && changeRows
        ? "Todo updated successfully"
        : "Todo update failed";

        res.send({ message, info });
    }

    deleteTodo = async(req, res, next) => {
        const result = await TodoModel.delete(req.params.id);

        if(!result) {
            throw new HttpException(404, "Todo not found!");
        }

        res.send("Todo has deleted!")
    }
}

module.exports = new TodoController();