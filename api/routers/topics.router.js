const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics.controller");
const { errors405s } = require("../errors");

topicsRouter.route("/").get(getAllTopics).all(errors405s);

module.exports = topicsRouter;
