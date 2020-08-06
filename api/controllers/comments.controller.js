const { editAComment, fetchAComment } = require("../models/comments.model");

exports.patchAComment = (req, res, next) => {
  const { comment_id } = req.params;
  const patchObj = req.body;
  editAComment(comment_id, patchObj)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAComment = (req, res, next) => {
  const { comment_id } = req.params;
  fetchAComment(comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
