import Ember from 'ember';

export default Ember.Component.extend({
  data: [],

  windowSize: 10,
  dataWindow: Ember.computed('data.[]', 'windowSize', function(){
    let data = this.get('data');
    let windowSize = this.get('windowSize');

    if(!windowSize) { windowSize = 1; }
    if(!data || data.length == 0) { return []; }

    return data.slice(Math.max(data.length - windowSize, 1));
  }),
});
