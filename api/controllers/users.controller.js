const {
  fetchAllUsers,
  fetchAUserByUsername,
} = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchAUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
