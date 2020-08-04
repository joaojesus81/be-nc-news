const e = require("express");

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
