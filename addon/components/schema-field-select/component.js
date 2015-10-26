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

  actions: {
    update() {
      let value = this.$('select').val();
      let document = this.get('document');
      let key = this.get('key');

      document.set(key, value);
      this.set('value', value);
    }
  }
});