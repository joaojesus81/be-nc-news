const e = require("express");

exports.errors405s = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed." });
};

exports.PSQLerrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input sintax." });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "That user doesn't exist." });
  } else {
    next(err);
  }
};

exports.customError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.catchAll = (err, req, res, next) => {
  res.status(418).send({ msg: "oh oh...", error: err });
};
