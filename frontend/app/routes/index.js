import Ember from 'ember';

export default Ember.Route.extend({
  model() {
  	return Ember.RSVP.hash({
  		temperatureRecords: this.store.findAll('temperature-record'),
  		humidityRecords: this.store.findAll('humidity-record')
  	});
  }
});
