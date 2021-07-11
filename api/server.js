const express = require("express");
const cors = require("cors");
const { logger } = require("./middleware/middleware");

const server = express();
server.use(cors());
server.use(express.json());
server.use(logger);

// remember express by default cannot parse JSON in request bodies
const usersRouter = require("./users/users-router");
server.use("/api/users", usersRouter);
// global middlewares and the user's router need to be connected here

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware! haha</h2>`);
});

module.exports = server;
