export default Ember.Controller.extend({

	shows: [],

	actions: {
		'addShow': function() {
			this.shows.pushObject(this.get('name'));
			this.set('name', '');
		}
	}

});