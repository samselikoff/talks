module.exports = function(app) {
  var express = require('express');
  var tripRouter = express.Router();
  tripRouter.get('/', function(req, res) {
    res.send({"trip":[]});
  });
  app.use('/api/trip', tripRouter);
};
