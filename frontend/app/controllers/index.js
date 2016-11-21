import Ember from 'ember';

export default Ember.Controller.extend({
  humidityData : [
    { time: new Date(2013, 8, 16), label: "Humidity", value: 88, type: "percent" },
    { time: new Date(2013, 8, 17), label: "Humidity", value: 60, type: "percent" },
    { time: new Date(2013, 8, 18), label: "Humidity", value: 71, type: "percent" },
    { time: new Date(2013, 8, 19), label: "Humidity", value: 73, type: "percent" },
    { time: new Date(2013, 8, 20), label: "Humidity", value: 62, type: "percent" },
    { time: new Date(2013, 8, 21), label: "Humidity", value: 80, type: "percent" },
    { time: new Date(2013, 8, 22), label: "Humidity", value: 88, type: "percent" },
    { time: new Date(2013, 8, 23), label: "Humidity", value: 88, type: "percent" },
    { time: new Date(2013, 8, 24), label: "Humidity", value: 88, type: "percent" },
    { time: new Date(2013, 8, 25), label: "Humidity", value: 60, type: "percent" },
    { time: new Date(2013, 8, 26), label: "Humidity", value: 71, type: "percent" },
    { time: new Date(2013, 8, 27), label: "Humidity", value: 73, type: "percent" },
    { time: new Date(2013, 8, 28), label: "Humidity", value: 62, type: "percent" },
    { time: new Date(2013, 8, 29), label: "Humidity", value: 80, type: "percent" },
    { time: new Date(2013, 8, 30), label: "Humidity", value: 60, type: "percent" },
    { time: new Date(2013, 8, 31), label: "Humidity", value: 71, type: "percent" },
    { time: new Date(2013, 8, 32), label: "Humidity", value: 73, type: "percent" },
    { time: new Date(2013, 8, 33), label: "Humidity", value: 62, type: "percent" },
    { time: new Date(2013, 8, 34), label: "Humidity", value: 80, type: "percent" },
    { time: new Date(2013, 8, 35), label: "Humidity", value: 60, type: "percent" },
    { time: new Date(2013, 8, 36), label: "Humidity", value: 71, type: "percent" },
    { time: new Date(2013, 8, 37), label: "Humidity", value: 73, type: "percent" },
    { time: new Date(2013, 8, 38), label: "Humidity", value: 62, type: "percent" },
    { time: new Date(2013, 8, 39), label: "Humidity", value: 80, type: "percent" },
  ],

  temperatureData: [
    {
      time: new Date(2013, 8, 16),
      label: "Temperature",
      value: 50,
      type: "temperature"
    }, {
      time: new Date(2013, 8, 17),
      label: "Temperature",
      value: 55,
      type: "temperature"
    }, {
      time: new Date(2013, 8, 18),
      label: "Temperature",
      value: 52,
      type: "temperature"
    }, {
      time: new Date(2013, 8, 19),
      label: "Temperature",
      value: 55,
      type: "temperature"
    }, {
      time: new Date(2013, 8, 20),
      label: "Temperature",
      value: 40,
      type: "temperature"
    }
  ],


});
