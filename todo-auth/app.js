const express = require("express");
const dotenv = require("dotenv");

let HttpException = require("./src/utils/HttpException.utils");
let errorMiddleware = require("./src/middleware/errorHandler.middleware");
const routeIndex = require("./src/routes/index");

// init express
const app = express();
// init environment
dotenv.config();
// parse request of content-type: application/json
// parse incoming request with JSON payloads
app.use(express.json());

const port = Number(process.env.PORT || 8000);

app.use('/api', routeIndex)

app.all("*", (req, res, next) => {
    const err = new HttpException(404, "Endpoint Not Found");
    next(err);
});

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`[Status] Server running on port ${port}`);
});