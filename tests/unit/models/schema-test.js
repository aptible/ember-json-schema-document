import Schema from 'ember-json-schema-document/models/schema';
import Property from 'ember-json-schema-document/models/property';
import Document from 'ember-json-schema-document/models/document';
import { module, test } from 'qunit';
import schemaFixture from '../../fixtures/default-nested-property-schema';
import arraySchemaFixture from '../../fixtures/location-schema';
import refSchemaFixture from '../../fixtures/ref-schema';

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

test('properties expose a stack linking back to the original schema', function(assert) {
  assert.equal(schema.properties.address.schemaStack.indexOf(schema), 0);
});

test('accessing referenced properties returns an instance of `Property` model', function(assert) {
  schema = new Schema(refSchemaFixture);

  assert.ok(schema.properties.str instanceof Property, 'str is an instance of Property');
  assert.equal(schema.properties.str.type, 'string');

  assert.ok(schema.properties.nested instanceof Property, 'nested is an instance of Property');
  assert.equal(schema.properties.nested.type, 'object');
});

test('accessing recursive properties return instances of `Property` model', function(assert) {
  schema = new Schema(refSchemaFixture);

  assert.ok(schema.properties.nested instanceof Property);
  assert.ok(schema.properties.nested.properties.value instanceof Property);
  assert.ok(schema.properties.nested.properties.value.properties.value instanceof Property);

  assert.equal(schema.properties.nested.properties.value.properties.value.type, 'object');
  assert.equal(schema.properties.nested.properties.value.properties.value.properties.key.type, 'string');
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

test('can build a new document prepopulated with data', function(assert) {
  let input = {
    address: {
      streetAddress: '123 Blah St.',
      city: 'Hope'
    }
  };

  let document = schema.buildDocument(input);
  let result = document.dump();

  assert.deepEqual(input, result);
});