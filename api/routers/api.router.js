const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router.js");
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const { getAPIJSON } = require("../controllers/api.controller");
const { errors405s } = require("../errors/");

apiRouter.route("/").get(getAPIJSON).all(errors405s);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
