import getProperties from '../utils/get-properties';
import Document from './document';
import Ember from 'ember';

export default class Schema {
  constructor(schema) {
    if (!schema) {
      throw new Error('You must provide a schema object to the Schema constructor.');
    }

    this._setupSchema(schema);
  }

  static load(schemaUrl, options, ajax = Ember.$.ajax) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      options.dataType = 'json';
      options.contentType = 'application/schema+json';

      ajax(schemaUrl, options).then(Ember.run.bind(null, (payload) => {
        if (payload) {
          resolve(new Schema(payload));
        } else {
          reject(`Unable to load schema located at ${schemaUrl}`);
        }
      }), Ember.run.bind(null, reject));
    });
  }

  get schema() {
    return this._schema;
  }

  get id() {
    return this._schema.id;
  }

  set schema(newSchema) {
    this._setupSchema(newSchema);
  }

  get required() {
    return this._schema.required || [];
  }

  get properties() {
    // TODO: throw an error if called on an array base type
    return getProperties(this, this._schema.properties);
  }

  get itemProperties() {
    // TODO: throw an error if called on an object base type
    return getProperties(this, this._schema.items.properties);
  }

  buildDocument(data) {
    return Document.build(this, this._schema.type, data);
  }

  _setupSchema(schema) {
    this._properties = null;
    this._schema = schema;
    this._schemaStack = [this];
  }

  get schemaStack() {
    return this._schemaStack;
  }

  resolveURI(uri) {
    let parts = uri.split('/');
    if (parts[0] === '' || parts[0] === '#') {
      parts.shift();
    }

    let property = this._schema;

    do {
      let part = parts.shift();
      property = property[part];
    } while (parts.length > 0);

    return property;
  }
}
