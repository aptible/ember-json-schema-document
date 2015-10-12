class ValueProxy {
  static build(document, propertyPath) {
    let parts = propertyPath.split('.');
    let property = document;
    let values = document._values;
    let part;

    do {
      part = parts.shift();
      property = property.properties[part];

      if (parts.length > 0) {
        values = document._values[part];

        if (!values) {
          if (property.type === 'array') {
            values = document._values[part] = [];
          } else {
            values = document._values[part] = Object.create(null);
          }
        }
      }
    } while (parts.length > 0);

    return new ValueProxy(property, values, part);
  }

  constructor(property, values, valuePath) {
    this._property = property;
    this._values = values;
    this._valuePath = valuePath;
  }

  set value(newValue) {
    if (!this._property) {
      throw new Error('You may not set a nonexistant field.');
    }

    this._values[this._valuePath] = newValue;
  }

  get value() {
    return this._values[this._valuePath];
  }
}

export default class Document {
  constructor(schema) {
    if (!schema) {
      throw new Error('You must provide a Schema instance to the Document constructor.');
    }

    this._schema = schema;
    this._values = Object.create(null);
    this._valueProxies = Object.create(null);
  }

  _valueProxyFor(path) {
    return this._valueProxies[path] = this._valueProxies[path] || ValueProxy.build(this, path);
  }

  get properties() {
    return this._schema.properties;
  }

  _getValueObject(propertyPath) {

  }

  set(propertyPath, value) {
    if (value === undefined) {
      throw new Error('You must provide a value as the second argument to `.set`');
    }

    let proxy = this._valueProxyFor(propertyPath);
    proxy.value = value;
  }

  get(propertyPath) {
    return this._valueProxyFor(propertyPath).value;
  }

  addItem(propertyPath, value) {

  }

  getItem(propertyPath, index) {
    let array = this.get(propertyPath) || [];

    return array[index];
  }

  toJSON() {
    return this._values;
  }
}
