const express = require("express");
const app = express();
const path = require("path");
const apiRouter = require("./api/routers/api.router");
const { customError, catchAll, PSQLerrors } = require("./api/errors");
const cors = require("cors");

app.use(cors());
app.use(allowCrossDomain);

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
);
app.use(express.json());
app.use("/api", apiRouter);
app.use(PSQLerrors);
app.use(customError);
app.use(catchAll);

app.all("*", (req, res, next) => {
  res.status(400).send({ msg: "Path does not exist." });
});

module.exports = { app };
