const express = require("express");

const UserController = require("../controllers/user.controller");
const Role = require("../utils/userRoles.utils");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const auth = require("../middleware/auth.middleware");
const {
  createUserSchema,
  updateUserSchema,
  validateLogin,
} = require("../middleware/validators/user.validator");

const router = express.Router();

// router.get("/id/:id", awaitHandlerFactory(UserController.getUserById));
// router.get("/username/:username", awaitHandlerFactory(UserController.getUserByUsername));
// router.get("/", awaitHandlerFactory(UserController.getAllusers));

router.get(
    "/", 
    auth(), 
    awaitHandlerFactory(UserController.getAllusers)
);

router.get(
    "/id/:id", 
    auth(), 
    awaitHandlerFactory(UserController.getUserById)
);

router.get(
  "/username/:username",
  auth(),
  awaitHandlerFactory(UserController.getUserByUsername)
);

router.get(
  "/whoami",
  auth(),
  awaitHandlerFactory(UserController.getCurrentUser)
);

router.post(
  "/",
  createUserSchema,
  awaitHandlerFactory(UserController.createUser)
);

router.patch(
  "/id/:id",
  auth(Role.Admin),
  updateUserSchema,
  awaitHandlerFactory(UserController.updateUser)
);

router.delete(
  "/id/:id",
  auth(Role.Admin),
  awaitHandlerFactory(UserController.deleteUser)
);

module.exports = router;
