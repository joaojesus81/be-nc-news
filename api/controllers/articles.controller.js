const {
  fetchAllArticles,
  fetchAnArticleById,
  editAnArticleVotes,
  postCommentByArticleId,
  fetchAllCommentsOfArticleId,
} = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  const queryObj = req.query;
  fetchAllArticles(queryObj)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAnArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchAnArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchAnArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  const articleQueries = { inc_votes };
  editAnArticleVotes(article_id, articleQueries)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postACommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const reqBody = req.body;
  postCommentByArticleId(article_id, reqBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllCommentsOfArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const queryObj = req.query;
  fetchAllCommentsOfArticleId(article_id, queryObj)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
