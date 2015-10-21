import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);

    let key = this.get('key');
    let document = this.get('document');
    let defaultValue = this.get('property.default');
    let initialValue = document.get(key) || defaultValue || '';

    this.set('value', initialValue);
  },

  setValue: Ember.observer('value', function() {
    let document = this.get('document');
    let key = this.get('key');

    document.set(key, this.get('value'));
  })
});