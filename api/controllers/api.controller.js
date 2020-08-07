const { fetchEndpointJSON } = require("../models/api.model");

exports.getAPIJSON = (req, res, next) => {
  fetchEndpointJSON((err, endpoints) => {
    if (err) next(err);
    res.status(200).send({ endpoints: JSON.parse(endpoints) });
  });
};
