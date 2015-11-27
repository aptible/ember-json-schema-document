import getProperties from '../utils/get-properties';
import buildDefaultValueForType from '../utils/build-default-value-for-type';
import checkValidity from '../utils/check-validity';

export default class Property {
  constructor(property, schemaStack) {
    if (!property) {
      throw new Error('You must provide a property definition to the Property constructor.');
    }

    this._property = property;
    this._schemaStack = schemaStack;
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

  resolveURI(uri) {
    let hashIdx = uri.indexOf('#');

    if (hashIdx === -1) {
      return this._property.properties[uri];
    }

    if (hashIdx === 0) {
      return this._schemaStack[0].resolveURI(uri.substr(1));
    }

    throw new Error('Only relative root references are implemented');
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

  get schemaStack() {
    return this._schemaStack;
  }
}
