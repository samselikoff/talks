import DS from 'ember-data';

var trip = DS.Model.extend({
  name: DS.attr(),
  cost: DS.attr(),
  date: DS.attr(),
});

export default trip;