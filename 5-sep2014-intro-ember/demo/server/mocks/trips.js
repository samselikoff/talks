module.exports = function(app) {
  var express = require('express');
  var tripsRouter = express.Router();
  tripsRouter.get('/', function(req, res) {
    res.send({"trips":[
      {
        id: 1,
        name: 'My summer trip',
        date: new Date(),
        months: 6,
        cost: 6000
      },
      {
        id: 2,
        name: 'Paris',
        date: new Date(),
        months: 3,
        cost: 4000
      },
    ]});
  });
  app.use('/api/trips', tripsRouter);
};
