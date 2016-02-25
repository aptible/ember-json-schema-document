import Ember from 'ember';
import Schema from './schema';
import buildDefaultValueForType from '../utils/build-default-value-for-type';
import checkValidity from '../utils/check-validity';
import ValueProxy from './value-proxy';

let uuid = 0;
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
    this._uuid = `document-${baseType}-${++uuid}`;
  }

  dump() {
    return this._values.serialize();
  }

  load() {
    throw new Error('Document#load must be overridden in the type specific base class');
  }

  toJSON() {
    Ember.deprecate(
      'Using Document#toJSON is deprecated, please use Document#dump instead.',
      false,
      { id: 'ember-json-schema-document.document.toJSON', until: '0.1.0' }
    );

    return this.dump(...arguments);
  }
}

export class ArrayDocument extends Document {
  constructor() {
    super(...arguments);

    this._documents = Ember.A();
    this._uuidIndexes = {};
  }

  _buildDocumentInstance() {
    // TODO: handle array of arrays (WAT?)
    let schema = new Schema(this._schemaItems);
    let document = schema.buildDocument();

    return document;
  }

  load(items) {
    if (!Array.isArray(items)) {
      throw new Error('You must pass an array to `load` for array-based documents');
    }

    items.forEach((item) => {
      this.addItem(item);
    });
  }

  dump(params = {}) {
    let values = this._values;

    if (params.excludeInvalid) {
      values = this.validValues();
    }

    return values.map((item) => {
      return item.serialize();
    });
  }

  validValues() {
    return this._values.filter((value, index) => {
      let document = this._documents[index];
      return document.isValid;
    });
  }

  addItem(item = {}) {
    if (this._baseType !== 'array') {
      throw new Error('You can only call `addItem` on documents with a base object of `array`.');
    }

    let document = this._buildDocumentInstance();
    document.load(item);

    Ember.run(() => {
      this._values.pushObject(document._values);
      this._documents.pushObject(document);
    });

    this._uuidIndexes[document._uuid] = this._documents.length - 1;

    return document;
  }

  getItem(index) {
    return this._documents[index];
  }

  removeItem(index) {
    let document = this.getItem(index);

    this._documents.removeAt(index);
    this._values.removeAt(index);

    this._uuidIndexes[document._uuid] = undefined;
  }

  removeObject(item) {
    let index = this._uuidIndexes[item._uuid];

    this.removeItem(index);
  }

  allItems() {
    return this._documents.slice();
  }

  get _schemaItems() {
    return this._schema._schema.items;
  }

  get values() {
    return this._documents;
  }
}

export class ObjectDocument extends Document {
  constructor(schema, baseType, data) {
    super(...arguments);

    this._valueProxies = Object.create(null);

    if (data) {
      this.load(data);
    }
  }

  load(data) {
    let properties = Object.keys(data);
    for (let i = 0, l = properties.length; i < l; i++) {
      let propertyName = properties[i];

      this.set(propertyName, data[propertyName]);
    }
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

    Ember.run(() => {
      let proxy = this._valueProxyFor(propertyPath);
      proxy.value = value;
      this.values.notifyPropertyChange(propertyPath);
    });
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
