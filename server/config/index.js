module.exports ={
  "controller" : {
    'relay1': {
      'webName': 'Water Pump',
      'schedule': [
        {'on': '9:00:00', 'off': '9:15:00'},
        {'on': '11:00:00', 'off': '11:15:00'},
        {'on': '13:00:00', 'off': '13:15:00'},
        {'on': '15:00:00', 'off': '15:15:00'},
        {'on': '17:00:00', 'off': '17:15:00'},
      ]
    },
    'relay2': {
      'webName': 'Bubbles',
      'schedule': [
        {'on': '08:30:00', 'off': '09:15:00'},
        {'on': '10:30:00', 'off': '11:15:00'},
        {'on': '12:30:00', 'off': '13:15:00'},
        {'on': '14:30:00', 'off': '15:15:30'},
        {'on': '16:30:00', 'off': '17:15:30'}
      ]
    },
    'relay3': {
      'webName': 'Lightning',
      'schedule': [
        {'on': '09:00:00', 'off': '21:00:00'}
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