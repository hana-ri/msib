const express = require("express");

const UserController = require("../controllers/user.controller");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const auth = require("../middleware/auth.middleware");
const {
  validateLogin
} = require("../middleware/validators/user.validator");

const router = express.Router();

router.post(
    "/login",
    validateLogin,
    awaitHandlerFactory(UserController.userLogin)
);

module.exports = router;