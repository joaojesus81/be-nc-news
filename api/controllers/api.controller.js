const { fetchEndpointJSON } = require("../models/api.model");

exports.getAPIJSON = (req, res, next) => {
  fetchEndpointJSON()
    .then((endpoints) => {
      const parsedEndpoints = JSON.parse(endpoints);
      res.status(200).send({ endpoints: parsedEndpoints });
    })
    .catch((err) => {
      next(err);
    });
};
