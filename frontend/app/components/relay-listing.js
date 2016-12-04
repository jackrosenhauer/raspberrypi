import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['list-group-item'],
  relay: null,

  actions: {
    toggleIsOn() {
      if(this.get('relay.isOn')) {
        this.send('turnOff');
      } else {
        this.send('turnOn');
      }
    },
    turnOff() {
      this.set('relay.isOn', false);
      this.get('relay').save();
    },
    turnOn() {
      this.set('relay.isOn', true);
      this.get('relay').save();
    }
  }
});
