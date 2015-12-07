import Ember from 'ember';

export function getPropertyInputType(property) {
  if (property.validValues && Array.isArray(property.validValues)) {
    return 'select';
  }

  if (property.type === 'boolean') {
    if (Ember.get(property, 'displayProperties.useToggle')) {
      return 'toggle';
    } else {
      return 'radio';
    }
  }

  return 'text';
}

export default Ember.Component.extend({
  tagName: '',

  propertyCollection: Ember.computed('properties.[]', function() {
    let propertyHash = this.get('properties');
    let propertyKeys = Object.keys(propertyHash);

    return propertyKeys.map((key) => {
      let property = propertyHash[key];

      return { key, property, type: getPropertyInputType(property),
               childProperties: property.properties };
    });
  })
});
