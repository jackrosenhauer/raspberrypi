import Ember from 'ember';

export default Ember.Component.extend({
  data: [],
  highchart: [],
  title: 'Line Graph',
  xAxis: 'Time',
  yAxis: 'Data',

  theData: Ember.computed('highchart', function(){
    return [{
      name: "Temperature",
      data: this.get('highchart')
    }];
  }),

  chartOptions: Ember.computed('title', 'xAxis', 'yAxis', function(){
    return {
      chart: {
        type: 'line',
        zoomType: 'x'
      },
      title: {
        text: this.get('title')
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: this.get('xAxis')
        }
      },
      yAxis: {
        title: {
          text: this.get('yAxis')
        }
      }
    }
  }),

  chartData: [{
    name: 'Jane',
    data: [1, 0, 4]
  }, {
    name: 'John',
    data: [5, 7, 3]
  }],


  windowSize: 10,
  dataWindow: Ember.computed('data.[]', 'windowSize', function(){
    let data = this.get('data');
    let windowSize = this.get('windowSize');

    if(!windowSize) { windowSize = 1; }
    if(!data || data.length == 0) { return []; }

    return data.slice(Math.max(data.length - windowSize, 1));
  }),
});
