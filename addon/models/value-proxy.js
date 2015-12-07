import Ember from 'ember';

class ValueProxy {
  static build(document, propertyPath) {
    let parts = propertyPath.split('.');
    let property = document;
    let values = document._values;
    let part;

    do {
      let _values = values;
      part = parts.shift();
      property = property.properties[part];

      if (parts.length > 0) {
        values = _values[part];
      }

      if (!values) {
        values = _values[part] = property.buildDefaultValue();
      }
    } while (parts.length > 0);

    return new ValueProxy(document, propertyPath, property, values, part);
  }

  constructor(document, propertyPath, property, values, valuePath) {
    this._document = document;
    this._propertyPath = propertyPath;
    this._property = property;
    this._values = values;
    this._valuePath = valuePath;
  }

  get valueType() {
    return this._property.type;
  }

  set value(newValue) {
    if (!this._property) {
      throw new Error('You may not set a nonexistant field.');
    }

    Ember.run(() => {
      Ember.set(this._values, this._valuePath, newValue);
    });
  }

  get value() {
    if (!(this._valuePath in this._values)) {
      this.value = this._property.buildDefaultValue();
    }

    return this._values[this._valuePath];
  }
}

export default ValueProxy;