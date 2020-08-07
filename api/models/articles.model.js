const connection = require("../../db/connection");

const checkExistingUsers = () => {
  return connection
    .select("username")
    .from("users")
    .then((users) => {
      const existingUsers = users.map(({ username }) => {
        return username;
      });
      return existingUsers;
    });
};

const checkExistingTopics = () => {
  return connection
    .select("slug")
    .from("topics")
    .then((topics) => {
      const existingTopics = topics.map(({ slug }) => {
        return slug;
      });
      return existingTopics;
    });
};

exports.fetchAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
}) => {
  return Promise.all([checkExistingUsers(), checkExistingTopics()]).then(
    ([users, topics]) => {
      if (
        (users.includes(author) || author === undefined) &&
        (topics.includes(topic) || topic === undefined)
      ) {
        if (order === "desc" || order === "asc") {
          return connection
            .select("articles.*")
            .from("articles")
            .leftJoin("comments", "articles.article_id", "comments.article_id")
            .groupBy("articles.article_id")
            .count("comments.article_id", { as: "comment_count" })
            .orderBy(sort_by, order)
            .modify((query) => {
              if (author) query.where("articles.author", author);
              if (topic) query.where("articles.topic", topic);
            });
        } else {
          return Promise.reject({
            status: 400,
            msg: "Please select either asc or desc for direction.",
          });
        }
      } else {
        return Promise.reject({
          status: 400,
          msg: "No such author or topic available.",
        });
      }
    }
  );
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
  if (body.length < 1) {
    return Promise.reject({
      status: 400,
      msg: "Please insert body to comment.",
    });
  } else {
    return connection("comments")
      .insert({
        author: username,
        article_id: article_id,
        body: body,
      })
      .returning("*");
  }
};

exports.fetchAllCommentsOfArticleId = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  if (order === "desc" || order === "asc") {
    return connection
      .select()
      .from("comments")
      .where("article_id", article_id)
      .modify((query) => {
        return query.orderBy(sort_by, order);
      })
      .then((response) => {
        if (response.length < 1) {
          return Promise.reject({
            status: 400,
            msg: "Could not find that article",
          });
        } else {
          return response;
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: "Please select either asc or desc for direction.",
    });
  }
};
