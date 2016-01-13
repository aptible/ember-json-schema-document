import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    let key = this.get('key');
    let document = this.get('document');
    let defaultValue = this.get('property.default');
    let initialValue =  '';
    let documentValue = document.get(key);

    if (typeof defaultValue !== 'undefined') {
      initialValue = defaultValue;
    }

    if (typeof documentValue !== 'undefined') {
      initialValue = documentValue;
    }

    this.set('value', initialValue);
    document.set(key, initialValue);
  },

  actions: {
    changed() {
      let document = this.get('document');
      let key = this.get('key');
      let value = this.$('input[type="radio"]:checked').val();

      if (value && value.toLowerCase() === 'true') {
        value = true;
      } else {
        value = false;
      }

      document.set(key, value);
      this.set('value', value);
      this.sendAction('changed', value);
    }
  }
});