const express = require("express");
const TodoController = require("../controllers/todo.controller");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

const router = express.Router();

router.get(
    "/list", 
    awaitHandlerFactory(TodoController.getListTodo)
);

router.post(
    "/",
    awaitHandlerFactory(TodoController.createTodo)
);

router.patch(
    "/:id", 
    awaitHandlerFactory(TodoController.updateTodo)
);

router.delete(
    "/:id", 
    awaitHandlerFactory(TodoController.deleteTodo)
);

module.exports = router;