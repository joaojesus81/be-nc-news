exports.up = function (knex) {
  return knex.schema.createTable("comments", (commentsTable) => {
    commentsTable.increments("comment_id").primary();
    commentsTable
      .string("author")
      .references("username")
      .inTable("users")
      .notNullable();
    commentsTable
      .integer("article_id")
      .references("article_id")
      .inTable("articles")
      .notNullable();
    commentsTable.integer("votes").defaultsTo(0);
    commentsTable
      .timestamp("created_at", { useTz: true })
      .defaultTo(knex.fn.now());
    commentsTable.text("body").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("comments");
};
