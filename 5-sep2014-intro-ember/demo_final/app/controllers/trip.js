/* global moment */
import Ember from 'ember';

export default Ember.ObjectController.extend({

  monthsLeft: function() {
    var today = moment();

    return moment(this.get('date')).diff(today, 'months');
  }.property('date'),

  monthlySavingsRequired: function() {
    return Math.floor(+this.get('cost') / +this.get('monthsLeft'));
  }.property('cost', 'monthsLeft'),

  actions: {
    toggleEditing: function() {
      this.toggleProperty('isEditing');
    }
  }
});
