const fs = require("fs");

exports.fetchEndpointJSON = (cb) => {
  return fs.readFile("./endpoints.json", "utf8", (err, data) => {
    if (err) {
      cb(err);
    } else {
      cb(null, data);
    }
  });
};
