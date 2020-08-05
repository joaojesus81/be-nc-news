const {
  fetchAllArticles,
  fetchAnArticleById,
  editAnArticleVotes,
  postCommentByArticleId,
} = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
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
      console.log(err);
      next(err);
    });
};
