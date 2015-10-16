import Ember from 'ember';

export default Ember.Component.extend({
  setup: function() {
    let key = this.get('property.key');
    let document = this.get('document');
    let defaultValue = this.get('property.default');
    let initialValue = Ember.get(document, key) || defaultValue || '';

    this.set('value', initialValue);
  }.on('init'),

  setValue: function() {
    let document = this.get('document');
    let key = this.get('property.key');

    Ember.set(document, key, this.get('value'));
  }.observes('value')
});