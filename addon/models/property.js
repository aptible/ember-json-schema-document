import getProperties from '../utils/get-properties';

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
    return getProperties(this, this._property.properties);
  }

  buildDefaultValue() {
    switch (this._property.type) {
    case 'object': return Object.create(null);
    case 'array': return [];
    default:
      return undefined;
    }
  }
}
