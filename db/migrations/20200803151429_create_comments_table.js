exports.up = function (knex) {
  console.log("creating comments table");
  return knex.schema.createTable("comments", (commentsTable) => {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").references("username").inTable("users");
    commentsTable
      .integer("article_id")
      .references("article_id")
      .inTable("articles");
    commentsTable.integer("votes").defaultsTo(0);
    commentsTable.string("body");
  });
};

exports.down = function (knex) {
  console.log("dropping the comments table");
  return knex.schema.dropTable("comments");
};
