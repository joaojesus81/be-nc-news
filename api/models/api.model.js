const fs = require("fs/promises");

exports.fetchEndpointJSON = (cb) => {
  return fs.readFile("./endpoints.json", "utf8");
};
