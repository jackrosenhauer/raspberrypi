import Ember from 'ember';

export default Ember.Controller.extend({
  temperatureData: Ember.computed.alias('model'),
  tempDataForGraph: Ember.computed('temperatureData.[]', function(){
    let data = this.get('temperatureData');
    if(!data) { return []; }

    return data.map((record) => {
      return [Date.parse(record.get('createdAt')), record.get('temperature')];
    });

  }),
});
