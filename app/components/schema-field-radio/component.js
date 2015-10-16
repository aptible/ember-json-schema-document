import Ember from 'ember';

export default Ember.Component.extend({
  setup: function() {
    let defaultValue = this.get('property.default');

    if(typeof defaultValue == 'undefined') {
      defaultValue = true;
    }

    this.set('value', defaultValue);
  }.on('init')
});