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
      }

      if (!values) {
        values = document._values[part] = property.buildDefaultValue();
      }
    } while (parts.length > 0);

    return new ValueProxy(property, values, part);
  }

  constructor(property, values, valuePath) {
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

    this._values[this._valuePath] = newValue;
  }

  get value() {
    if (!(this._valuePath in this._values)) {
      this.value = this._property.buildDefaultValue();
    }

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
    let proxy = this._valueProxyFor(propertyPath);

    if (proxy.valueType !== 'array') {
      throw new Error('You can only call `addItem` on properties of type `array`.');
    }

    proxy.value.push(value);
  }

  getItem(propertyPath, index) {
    let array = this.get(propertyPath) || [];

    return array[index];
  }

  toJSON() {
    return this._values;
  }
}
