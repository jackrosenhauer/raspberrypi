import Ember from 'ember';

export default Ember.Controller.extend({
  refreshInterval: 5000,

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

  init(){
    Ember.run.later(this, this.reloadTempRecords, this.get('refreshInterval'));
    Ember.run.later(this, this.reloadHumidityRecords, this.get('refreshInterval'));
  },

  lastTemperatureRecord: Ember.computed('temperatureData.[]', function(){
    return this.get('temperatureData').sortBy('id').get('lastObject');
  }),

  lastHumidityRecord: Ember.computed('humidityData.[]', function(){
    return this.get('humidityData').sortBy('id').get('lastObject');
  }),

  reloadTempRecords() {
    this.store.query('temperature-record', { startingDate: this.get('lastTemperatureRecord.createdAt') })
      .then((records) => {
        Ember.run.later(this, this.reloadTempRecords, this.get('refreshInterval'));
      });
  },

  reloadHumidityRecords() {
    this.store.query('humidity-record', { startingDate: this.get('lastHumidityRecord.createdAt') })
      .then((records) => {
        Ember.run.later(this, this.reloadHumidityRecords, this.get('refreshInterval'));
      });
  },

  humidityDataForGraph: Ember.computed('humidityData.[]', function(){
    let data = this.get('humidityData');
    if(!data) { return []; }

    return data.map((record) => {
      return [Date.parse(record.get('createdAt')), record.get('humidity')];
    });
  })

});
