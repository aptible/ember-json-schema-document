import Ember from 'ember';
import Schema from './schema';
import buildDefaultValueForType from '../utils/build-default-value-for-type';
import checkValidity from '../utils/check-validity';

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

export default class Document {
  static build(schema, baseType) {
    if (baseType === 'array') {
      return new ArrayDocument(...arguments);
    } else if (baseType === 'object') {
      return new ObjectDocument(...arguments);
    } else {
      throw new Error('What are you doing here?');
    }
  }

  constructor(schema, baseType) {
    if (!schema) {
      throw new Error('You must provide a Schema instance to the Document constructor.');
    }

    this._schema = schema;
    this._baseType = baseType;
    this._values = buildDefaultValueForType(this._baseType);
  }

  toJSON() {
    return this._values;
  }
}

export class ArrayDocument extends Document {
  constructor() {
    super(...arguments);

    this._documents = Ember.A();
  }

  _buildDocumentInstance() {
    // TODO: handle array of arrays (WAT?)
    let schema = new Schema(this._schema._schema.items);
    let document = schema.buildDocument();

    return document;
  }

  addItem() {
    if (this._baseType !== 'array') {
      throw new Error('You can only call `addItem` on documents with a base object of `array`.');
    }

    let document = this._buildDocumentInstance();

    Ember.run(() => {
      this._values.pushObject(document._values);
      this._documents.pushObject(document);
    });

    return document;
  }

  getItem(index) {
    return this._documents[index];
  }

  removeItem(index) {
    this._documents.removeAt(index);
    this._values.removeAt(index);
  }

  allItems() {
    return this._documents.slice();
  }

  get values() {
    return this._documents;
  }
}

export class ObjectDocument extends Document {
  constructor() {
    super(...arguments);

    this._valueProxies = Object.create(null);
  }

  _valueProxyFor(path) {
    return this._valueProxies[path] = this._valueProxies[path] || ValueProxy.build(this, path);
  }

  get properties() {
    return this._schema.properties;
  }

  get values() {
    return this._values;
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

  validValuesFor(propertyPath) {
    return this._valueProxyFor(propertyPath)._property.validValues;
  }

  get isValid() {
    return checkValidity(this, this._values);
  }

  get required() {
    return this._schema.required;
  }
}
