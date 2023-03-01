const jwt = require("jsonwebtoken");
const brcypt = require("bcrypt");
const dotenv = require("dotenv");
const { validationResult } = require("express-validator");

const UserModel = require("../models/User.model");
const HttpException = require("../utils/HttpException.utils");
const { User } = require("../utils/userRoles.utils");

dotenv.config();

class UserController {
    getAllusers = async (req, res, next) => {
      let userList = await UserModel.find();
      if (!userList.length) {
        throw new HttpException(404, "Users not found");
      }
  
      userList = userList.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
  
      res.send(userList);
    };
  
    getUserById = async (req, res, next) => {
      const user = await UserModel.findOne({ id: req.params.id });
      if (!user) {
        throw new HttpException(404, "User not found");
      }
      const { password, ...userWithoutPassword } = user;
  
      res.send(userWithoutPassword);
    };
  
    getUserByEmail = async (req, res, next) => {
      const user = await UserModel.findOne({ email: req.params.email });
      if (!user) {
        throw new HttpException(404, "User not found");
      }
  
      const { password, ...userWithoutPassword } = user;
  
      res.send(userWithoutPassword);
    };
  
    getCurrentUser = async (req, res, next) => {
      const { password, ...userWithoutPassword } = req.currentUser;
  
      res.send(userWithoutPassword);
    };
  
    createUser = async (req, res, next) => {
      this.checkValidation(req);
  
      await this.hashPassword(req);
  
      const result = await UserModel.create(req.body);
  
      if (!result) {
        throw new HttpException(500, "Something went wrong");
      }
  
      res.status(201).send("User was created!");
    };
  
    updateUser = async (req, res, next) => {
      this.checkValidation(req);
  
      await this.hashPassword(req);
  
      const { confirm_password, ...restOfUpdates } = req.body;
  
      // do the update query and get the result
      // it can be partial edit
      const result = await UserModel.update(restOfUpdates, req.params.id);
  
      if (!result) {
        throw new HttpException(404, "Something went wrong");
      }
  
      const { affectedRows, changeRows, info } = result;
  
      const message = !affectedRows
        ? "User not found"
        : affectedRows && changeRows
        ? "User updated successfully"
        : "update failed";
  
      res.send({ message, info });
    };
  
    deleteUser = async (req, res, next) => {
      const result = await UserModel.delete(req.params.id);
      if (!result) {
        throw new HttpException(404, "User not found");
      }
      res.send("User has been deleted");
    };
  
    userLogin = async (req, res, next) => {
      this.checkValidation(req);
  
      const { email, password: pass } = req.body;
      console.log(email);
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        throw new HttpException(401, "Unable to login!");
      }
  
      const isMatch = await brcypt.compare(pass, user.password);
  
      if (!isMatch) {
        throw new HttpException(401, "Incorrect password!");
      }
  
      const secretKey = process.env.SECRET_JWT || "";
      
      const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
        expiresIn: process.env.EXPIRES_IN,
      });
  
      const { password, ...userWithoutPassword } = user;
  
      res.send({ ...userWithoutPassword, token });
    };
  
    checkValidation = (req) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new HttpException(400, "Validation", errors);
      }
    };
  
    // hash password if exists
    hashPassword = async (req) => {
      if (req.body.password) {
        req.body.password = await brcypt.hash(req.body.password, 8);
      }
    };
  }
  
  module.exports = new UserController();