import getProperties from '../utils/get-properties';
import buildDefaultValueForType from '../utils/build-default-value-for-type';

export default class Property {
  constructor(property) {
    if (!property) {
      throw new Error('You must provide a property definition to the Property constructor.');
    }

    this._property = property;
  }

  get type() {
    return this._property.type;
  }

  get properties() {
    if (this._property.properties) {
      return getProperties(this, this._property.properties);
    }

    return null;
  }

  get validValues() {
    return this._property.enum;
  }

  buildDefaultValue() {
    return buildDefaultValueForType(this._property.type);
  }

  isValid(object) {
    let { required, properties, validValues } = this;

    for (let i = 0, l = required.length; i < l; i++) {
      let requiredPropertyName = required[i];
      let value = object && object[requiredPropertyName];

      // handles nested properties
      if (properties[requiredPropertyName] && !properties[requiredPropertyName].isValid(value)) {
        return false;
      }

      // handles normal values
      if (!value) {
        return false;
      }
    }

    // handles validValues / enum
    if (validValues && validValues.indexOf(object) === -1) {
      return false;
    }

    return true;
  }

  get required() {
    return this._property.required || [];
  }
}
