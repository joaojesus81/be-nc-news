const connection = require("../../db/connection");
const fs = require("fs");

exports.fetchEndpointJSON = (cb) => {
  fs.readFile("./endpoints.json", "utf8", (err, data) => {
    if (err) throw err;
    cb(null, data);
  });
};
