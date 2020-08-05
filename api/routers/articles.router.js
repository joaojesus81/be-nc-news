const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getAnArticleById,
  patchAnArticleVotes,
  postACommentByArticleId,
  getAllCommentsOfArticleId,
} = require("../controllers/articles.controller");
const { errors405s } = require("../errors");

articlesRouter.route("/").get(getAllArticles).all(errors405s);
articlesRouter
  .route("/:article_id")
  .get(getAnArticleById)
  .patch(patchAnArticleVotes)
  .all(errors405s);
articlesRouter
  .route("/:article_id/comments")
  .get(getAllCommentsOfArticleId)
  .post(postACommentByArticleId)
  .all(errors405s);

module.exports = articlesRouter;
