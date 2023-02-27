const { body } = require("express-validator");
const Role = require("../../utils/userRoles.utils");

exports.createUserSchema = [
    body("email")
        .exists()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Must be a valid email")
        .normalizeEmail(),
    body("role")
        .exists()
        .isIn([Role.Admin, Role.User])
        .withMessage("Invalid Role type"),
    body("password")
        .exists()
        .withMessage("Please fill the password field")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters"),        
    body("confirm_password")
        .exists()
        .withMessage("Please confirm password")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("confirm_password field must have the same value as the password field."),
    body("status")
        .exists()
        .withMessage("fill the status")
        .isBoolean()
        .withMessage("must be a boolean.")        
];

exports.updateUserSchema = [
    body("email")
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body("role")
        .optional()
        .isIn([Role.Admin, Role.User])
        .withMessage("Invalid Role type"),
    body("password")
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .custom((value, { req }) => !!req.body.confirm_password)
        .withMessage('Please confirm your password'),
    body("confirm_password")
        .optional()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
    body("status")
        .optional()
        .isBoolean()
        .withMessage("must be a boolean.")  
];

exports.validateLogin = [
    body("email")
        .exists()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email"),
    body("password")
        .exists()
        .withMessage("Password is required")
        .notEmpty()
        .withMessage("Password must be filled")
];