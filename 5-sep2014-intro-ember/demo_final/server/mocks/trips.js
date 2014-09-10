module.exports = function(app) {
  var express = require('express');
  var tripsRouter = express.Router();
  tripsRouter.get('/', function(req, res) {
    res.send({"trips":[
      {
        id: 1,
        name: 'My summer trip',
        date: '2015-06-01',
        months: 6,
        cost: 6000
      },
      {
        id: 2,
        name: 'Paris',
        date: '2015-06-01',
        months: 3,
        cost: 4000
      },
    ]});
  });
  app.use('/api/trips', tripsRouter);
};
