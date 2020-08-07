const ENV = process.env.NODE_ENV || "production";
const testData = require("./test-data");
const devData = require("./development-data");

const data = {
  development: devData,
  test: testData,
  production: devData,
};

module.exports = data[ENV];
