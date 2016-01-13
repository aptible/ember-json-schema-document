import Ember from 'ember';

export default Ember.Mixin.create({
  init() {
    this._super(...arguments);

    let key = this.get('key');
    let document = this.get('document');
    let defaultValue = this.get('property.default');
    let initialValue = document.get(key) || defaultValue || '';

    this.set('value', initialValue);
    document.set(key, initialValue);
  },

  getCurrentValue() {
    this.$('input').val();
  },

  disabled: Ember.computed('property.readonly', function() {
    if (this.get('property.readonly')) {
      return 'disabled';
    }

    return false;
  }),

  actions: {
    update(value) {
      if (typeof value === 'undefined') {
        value = this.getCurrentValue();
      }

      let document = this.get('document');
      let key = this.get('key');

      document.set(key, value);
      this.set('value', value);
      this.sendAction('changed', value);
    }
  }
});
