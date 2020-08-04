const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getAnArticleById,
  patchAnArticleVotes,
} = require("../controllers/articles.controller");

articlesRouter.get("/", getAllArticles);
articlesRouter
  .route("/:article_id")
  .get(getAnArticleById)
  .patch(patchAnArticleVotes);

module.exports = articlesRouter;
