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

  buildDefaultValue() {
    return buildDefaultValueForType(this._property.type);
  }

  isValid(object) {
    let { properties } = this;

    for (let i = 0, l = this.required.length; i < l; i++) {
      let required = this.required[i];
      let value = object && object[required];

      // handles nested properties
      if (properties[required] && !properties[required].isValid(value)) {
        return false;
      }

      // handles normal values
      if (!value) {
        return false;
      }
    }

    return true;
  }

  get required() {
    return this._property.required || [];
  }
}
