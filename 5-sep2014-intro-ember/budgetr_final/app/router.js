import Ember from 'ember';

var Router = Ember.Router.extend({
  location: DemoENV.locationType
});

Router.map(function() {
  this.resource('trips', {path: '/'}, function() {
    this.resource('trip', {path: '/:trip_id'});
  });
});

export default Router;
