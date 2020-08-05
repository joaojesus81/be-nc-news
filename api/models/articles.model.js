const connection = require("../../db/connection");
const { into, returning } = require("../../db/connection");

exports.fetchAllArticles = () => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.article_id", { as: "comment_count" });
};

exports.fetchAnArticleById = (article_id) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.article_id", {
      as: "comment_count",
    })
    .where("articles.article_id", article_id)
    .then((article) => {
      if (article.length < 1) {
        return Promise.reject({
          status: 400,
          msg: "The selected article does not exist.",
        });
      } else {
        return article;
      }
    });
};

exports.editAnArticleVotes = (article_id, { inc_votes }) => {
  // aware that increment also adds negative numbers correctly because it always translates to SET in sql but wanted an opportunity to use modify.
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Incorrect value in object.",
    });
  } else {
    return connection("articles")
      .where("article_id", article_id)
      .modify((query) => {
        if (inc_votes >= 0) {
          return query.increment("votes", Math.abs(inc_votes));
        } else {
          return query.decrement("votes", Math.abs(inc_votes));
        }
      })
      .returning(["*"]);
  }
};

exports.postCommentByArticleId = (article_id, { username, body }) => {
  return connection("comments")
    .insert({
      author: username,
      article_id: article_id,
      body: body,
    })
    .returning("*");
};
