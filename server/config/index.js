module.exports = {
  'relay': {
    'name': 'relay1',
    'rename': 'Lightning',
    'schedule': [
      {
        'on': '9:00',
        'off': '10:00'
      },
      {
        'on': '11:00',
        'off': '12:00'
      }
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
  },
  'alerts': {
    'email': 'jack@jrosedev.com'
  }
};
