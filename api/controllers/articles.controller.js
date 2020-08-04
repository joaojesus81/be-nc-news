const { fetchAllArticles } = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.getAUserByUsername = (req, res, next) => {
//   const { username } = req.params;
//   fetchAUserByUsername(username)
//     .then((user) => {
//       res.status(200).send({ user });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
