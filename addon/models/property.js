import getProperties from '../utils/get-properties';
import buildDefaultValueForType from '../utils/build-default-value-for-type';
import checkValidity from '../utils/check-validity';

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

  get displayProperties() {
    return this._property.displayProperties;
  }

  get default() {
    return this._property.default;
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
    return checkValidity(this, object);
  }

  get required() {
    return this._property.required || [];
  }
}
