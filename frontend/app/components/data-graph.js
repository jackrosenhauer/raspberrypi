import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['data-graph'],
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
        text: null
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
    };
  }),

});