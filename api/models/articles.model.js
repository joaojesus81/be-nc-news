const connection = require("../../db/connection");

exports.fetchAllArticles = () => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count("comments.article_id", { as: "comment_count" });
};
