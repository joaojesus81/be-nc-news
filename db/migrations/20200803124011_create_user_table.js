exports.up = function (knex) {
  console.log("creating the user table");
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.string("username").primary().unique();
    usersTable.string("avatar_url");
    usersTable.string("name");
  });
};

exports.down = function (knex) {
  console.log("dropping the user table");
  return knex.schema.dropTable("users");
};
