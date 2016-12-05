import Ember from 'ember';

export default Ember.Component.extend({
  relays: [],
  orderedRelays: Ember.computed('relays.[]', function(){
    return this.get('relays').sortBy('id');
  }),
});
