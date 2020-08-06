const commentsRouter = require("express").Router();
const {
  patchAComment,
  getAComment,
} = require("../controllers/comments.controller");
const { errors405s } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .get(getAComment)
  .patch(patchAComment)
  .all(errors405s);

module.exports = commentsRouter;
