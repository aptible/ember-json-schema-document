import Ember from 'ember';
import SchemaFieldInitializerMixin from 'ember-json-schema/mixins/components/schema-field-initializer';

export default Ember.Component.extend(SchemaFieldInitializerMixin, {
  disabled: Ember.computed('property.displayProperties.disabled', function() {
    if (this.get('property.displayProperties.disabled')) {
      return 'disabled';
    }

    return false;
  })
});