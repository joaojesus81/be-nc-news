const connection = require("../../db/connection");

exports.fetchAllUsers = () => {
  return connection.select().from("users");
};

exports.fetchAUserByUsername = (username) => {
  return connection
    .select()
    .from("users")
    .where("username", username)
    .then((user) => {
      if (user.length < 1) {
        return Promise.reject({ status: 400, msg: "User not found" });
      } else {
        return user;
      }
    });
};
