const usersRouter = require("express").Router();
const {
  getAllUsers,
  getAUserByUsername,
} = require("../controllers/users.controller");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getAUserByUsername);

module.exports = usersRouter;
