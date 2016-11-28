import Ember from 'ember';

export default Ember.Controller.extend({
  temperatureData: Ember.computed.alias('model'),
  tempDataForGraph: Ember.computed('temperatureData.[]', function(){
    let data = this.get('temperatureData');
    if(!data) { return []; }

    return data.map((rec) => {
      console.log("hit");
      return Ember.Object.create({
        value: rec.get('temperature'),
        time: new Date(rec.get('createdAt')),
        label: 'Temperature'
      });
    });
  }),
});
