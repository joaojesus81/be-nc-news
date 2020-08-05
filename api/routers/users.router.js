const usersRouter = require("express").Router();
const {
  getAllUsers,
  getAUserByUsername,
} = require("../controllers/users.controller");
const { errors405s } = require("../errors");

usersRouter.route("/").get(getAllUsers).all(errors405s);
usersRouter.route("/:username").get(getAUserByUsername).all(errors405s);

module.exports = usersRouter;
