module.exports ={
  "controller" : {
    'relay1': {
      'webName': 'Lightning',
      'schedule': [
        {'on': '01:42:00', 'off': '01:42:30'},
        {'on': '01:43:00', 'off': '01:43:30'},
        {'on': '01:44:00', 'off': '01:44:30'},
        {'on': '01:45:00', 'off': '01:45:30'},
      ]
    },
    'sensor': {
      'name': 'Hygrometer',
      'temperature': {
        'min': 60,
        'max': 90
      },
      'humidity': {
        'min': 20,
        'max': 90
      }
    }
  },
  "alerts" : {
    "enabled": false,

  }
};