const express = require('express');
const todoRoutes = require('./todo.route');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const apiRouter = express.Router();

apiRouter.use('/todo', todoRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/auth', authRoutes);

module.exports = apiRouter;