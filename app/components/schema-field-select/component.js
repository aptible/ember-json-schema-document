import Ember from 'ember';

export default Ember.Component.extend({
  options: Ember.computed('property', function() {
    return this.get('property._property.enum')
  }),

  selected: Ember.computed('document', function() {
    let key = this.get('property.key');
    let document = this.get('document');

    return Ember.get(document, key);
  }),

  actions: {
    update: function() {
      let value = this.$('select').val();
      let document = this.get('document');
      let key = this.get('property.key');

      Ember.set(document, key, value);
      this.attrs.update(value);
    }
  }
});