exports.up = function (knex) {
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title");
    articlesTable.text("body");
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic").references("slug").inTable("topics");
    articlesTable.string("author").references("username").inTable("users");
    articlesTable
      .timestamp("created_at", { useTz: true })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("articles");
};
