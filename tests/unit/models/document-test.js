import Schema from 'ember-json-schema-document/models/schema';
import Document from 'ember-json-schema-document/models/document';
import { module, test, skip } from 'qunit';
import schemaFixture from '../../fixtures/default-nested-property-schema';

module('models/document', {
  beforeEach() {
    this.schema = new Schema(schemaFixture);
    this.document = this.schema.buildDocument();
  }
});

test('requires a schema', function(assert) {
  assert.throws(function() {
    new Document();
  }, /You must provide a Schema instance to the Document constructor/);
});

test('dump and toJSON return equal values', function(assert) {
  this.document.set('address.streetAddress', '123 Blah St.');
  this.document.set('address.city', 'Hope');

  let dumpResult = this.document.dump();
  let toJSONResult = this.document.toJSON();

  assert.deepEqual(dumpResult, {
    address: {
      streetAddress: '123 Blah St.',
      city: 'Hope'
    }
  });

  assert.deepEqual(toJSONResult, {
    address: {
      streetAddress: '123 Blah St.',
      city: 'Hope'
    }
  });

  assert.deepEqual(toJSONResult, dumpResult);
});

test('serialize skips null and undefined values', function(assert) {
  this.document.set('address.streetAddress', null);
  this.document.set('address.city', 'San Diego');

  let dumpResult = this.document.dump();
  assert.deepEqual(dumpResult, { address: { city: 'San Diego' } });
});

skip('throw an error if calling `dump` when required fields are not specified');
skip('handle array properties (where you have many of a given item)');
skip('add validations when setting property types');
