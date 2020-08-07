const { fetchEndpointJSON } = require("../models/api.model");

exports.getAPIJSON = (req, res, next) => {
  fetchEndpointJSON((err, endpoints) => {
    const parsedEndpoints = JSON.parse(endpoints);
    res.status(200).send(parsedEndpoints);
  });
};
