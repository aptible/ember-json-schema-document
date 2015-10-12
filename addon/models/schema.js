import getProperties from '../utils/get-properties';
import Document from './document';

export default class Schema {
  constructor(schema) {
    if (!schema) {
      throw new Error('You must provide a schema object to the Schema constructor.');
    }

    this._setupSchema(schema);
  }

  get schema() {
    return this._schema;
  }

  set schema(newSchema) {
    this._setupSchema(newSchema);
  }

  get properties() {
    return getProperties(this, this._schema.properties);
  }

  buildDocument(data) {
    return new Document(this, data);
  }

  _setupSchema(schema) {
    this._properties = null;
    this._schema = schema;
  }
}
