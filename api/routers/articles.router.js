const articlesRouter = require("express").Router();
const { getAllArticles } = require("../controllers/articles.controller");

articlesRouter.get("/", getAllArticles);
// articlesRouter.get("/:username", getAnArticleById);

module.exports = articlesRouter;
