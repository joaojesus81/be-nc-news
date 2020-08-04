const express = require("express");
const app = express();
const apiRouter = require("./api/routers/api.router");
const { customError, catchAll } = require("./api/errors");

app.use(express.json());
app.use("/api", apiRouter);
app.use(customError);
app.use(catchAll);
app.all("*", (req, res, next) => {
  res.status(400).send({ msg: "Path does not exist." });
});

module.exports = app;
