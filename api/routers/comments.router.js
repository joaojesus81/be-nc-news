const commentsRouter = require("express").Router();
const {
  patchAComment,
  getAComment,
  deleteAComment,
} = require("../controllers/comments.controller");
const { errors405s } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .get(getAComment)
  .patch(patchAComment)
  .delete(deleteAComment)
  .all(errors405s);

module.exports = commentsRouter;
