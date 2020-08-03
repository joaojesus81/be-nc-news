exports.up = function (knex) {
  console.log("creating the articles table");
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title");
    articlesTable.string("body");
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic").references("slug").inTable("topics");
    articlesTable.string("author").references("username").inTable("users");
    articlesTable
      .timestamp("create_at", { useTz: true })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  console.log("dropping the articles table");
  return knex.schema.dropTable("articles");
};
