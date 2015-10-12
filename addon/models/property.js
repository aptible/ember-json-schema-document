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
    return getProperties(this, this._property.properties);
  }

  buildDefaultValue() {
    return buildDefaultValueForType(this._property.type);
  }
}
