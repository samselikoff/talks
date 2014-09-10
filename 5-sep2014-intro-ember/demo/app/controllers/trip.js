import Ember from 'ember';

export default Ember.ObjectController.extend({
  monthlySavingsRequired: function() {
    return Math.floor(+this.get('cost') / +this.get('months'));
  }.property('cost', 'months')
});
