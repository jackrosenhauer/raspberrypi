import Ember from 'ember';

export default Ember.Controller.extend({
  temperatureData: Ember.computed.alias('model.temperatureRecords'),
  humidityData: Ember.computed.alias('model.humidityRecords'),
  relays: Ember.computed.alias('model.relays'),

  tempDataForGraph: Ember.computed('temperatureData.[]', function(){
    let data = this.get('temperatureData');
    if(!data) { return []; }

    return data.map((record) => {
      return [Date.parse(record.get('createdAt')), record.get('temperature')];
    });

  }),

  humidityDataForGraph: Ember.computed('humidityData.[]', function(){
    let data = this.get('humidityData');
    if(!data) { return []; }

    return data.map((record) => {
      return [Date.parse(record.get('createdAt')), record.get('humidity')];
    });
  })

});
