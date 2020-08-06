const connection = require("../../db/connection");

exports.fetchAComment = (comment_id) => {
  return connection.select().from("comments").where({ comment_id });
};

exports.editAComment = (comment_id, { inc_votes }) => {
  return connection("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then((comment) => {
      if (comment.length < 1) {
        return Promise.reject({ status: 400, msg: "No such comment." });
      } else {
        return comment;
      }
    });
};
