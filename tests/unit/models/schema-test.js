import Schema from 'ember-json-schema/models/schema';
import Property from 'ember-json-schema/models/property';
import Document from 'ember-json-schema/models/document';
import { module, test } from 'qunit';
import schemaFixture from '../../fixtures/default-nested-property-schema';
import arraySchemaFixture from '../../fixtures/location-schema';

let schema;
module('models/schema', {
  beforeEach() {
    schema = new Schema(schemaFixture);
  }
});

test('accepts a schema to constructor', function(assert) {
  assert.ok(schema, 'can create a schema');
  assert.equal(schema.schema, schemaFixture, 'keeps track of raw schema');
});

test('throws an error if schema is not provided to constructor', function(assert) {
  assert.throws(function() {
    new Schema();
  }, /You must provide a schema object to the Schema constructor./);
});

test('accessing properties returns a list of properties', function(assert) {
  let propertyKeys = Object.keys(schema.properties);

  assert.deepEqual(['description', 'address', 'phoneNumber'], propertyKeys, 'known keys are present');
});

test('accessing properties returns an instance of `Property` model', function(assert) {
  assert.ok(schema.properties.address instanceof Property, 'address is an instance of Property');
  assert.ok(schema.properties.phoneNumber instanceof Property, 'phoneNumber is an instance of Property');

  assert.equal(schema.properties.address.type, 'object');
  assert.equal(schema.properties.phoneNumber.type, 'array');
});

test('can build a new document using this schema', function(assert) {
  let doc = schema.buildDocument();

  assert.ok(doc instanceof Document, 'buildDocument returns an instance of Document model');
});

test('itemProperties returns a list of properties', function(assert) {
  let arraySchema = new Schema(arraySchemaFixture);
  let propertyKeys = Object.keys(arraySchema.itemProperties);

  assert.deepEqual(['description', 'streetAddress', 'city', 'state', 'zip'],
                   propertyKeys, 'known keys are present');
});
