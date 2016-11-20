import Ember from 'ember';

export default Ember.Component.extend({

  timeSeriesLineContent: [
    {
      time: new Date(2013, 8, 16),
      label: "Humidity",
      value: 17326,
      type: "percent"
    }, {
      time: new Date(2013, 8, 16),
      label: "Temperature",
      value: 4515,
      type: "temperature"
    }, {
      time: new Date(2013, 8, 17),
      label: "Humidity",
      value: 15326,
      type: "percent"
    }, {
      time: new Date(2013, 8, 17),
      label: "Temperature",
      value: 1515,
      type: "temperature"
    }, {
      time: new Date(2013, 8, 18),
      label: "Humidity",
      value: 14326,
      type: "percent"
    }, {
      time: new Date(2013, 8, 18),
      label: "Temperature",
      value: 8518,
      type: "temperature"
    }, {
      time: new Date(2013, 8, 19),
      label: "Humidity",
      value: 42301,
      type: "percent"
    }, {
      time: new Date(2013, 8, 19),
      label: "Temperature",
      value: 90191,
      type: "temperature"
    }, {
      time: new Date(2013, 8, 20),
      label: "Humidity",
      value: 57326,
      type: "percent"
    }, {
      time: new Date(2013, 8, 20),
      label: "Temperature",
      value: 39544,
      type: "temperature"
    }
  ],
});
