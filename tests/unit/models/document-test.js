import Schema from 'ember-json-schema/models/schema';
import Document from 'ember-json-schema/models/document';
import { module, test, skip } from 'qunit';
import schemaFixture from '../../fixtures/default-nested-property-schema';
import arrayBaseObjectFixture from '../../fixtures/location-schema';

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

test('can set a value for a root property', function(assert) {
  this.document.set('description', 'awesome sauce');

  assert.equal(this.document.get('description'), 'awesome sauce');
});

test('can set a value for a nested property', function(assert) {
  this.document.set('address.streetAddress', '123 Blah St.');

  assert.equal(this.document.get('address.streetAddress'), '123 Blah St.');
});

test('using an invalid property throws an error', function(assert) {
  assert.throws(function() {
    this.document.set('address.nonExistant', 'foo');
  }, /You may not set a nonexistant field/);
});

test('set without a value throws an error', function(assert) {
  assert.throws(function() {
    this.document.set('address');
  }, /You must provide a value as the second argument to `.set`/);
});

test('toJSON returns a object with values that were set', function(assert) {
  this.document.set('address.streetAddress', '123 Blah St.');
  this.document.set('address.city', 'Hope');

  // TODO: deal with phoneNumber array somehow

  let result = this.document.toJSON();

  assert.deepEqual(result, {
    address: {
      streetAddress: '123 Blah St.',
      city: 'Hope'
    }
  });
});

test('calling addItem on a non-array throws', function(assert) {
  let numberInstance = {
    location: 'home',
    code: '8675309'
  };

  assert.throws(() => {
    this.document.addItem('address', numberInstance);
  }, /You can only call `addItem` on properties of type `array`./);
});

test('can add items to an array field', function(assert) {
  let numberInstance = {
    location: 'home',
    code: '8675309'
  };

  this.document.addItem('phoneNumber', numberInstance);

  let result = this.document.getItem('phoneNumber', 0);

  assert.deepEqual(result, numberInstance);
});

test('add array as base object type', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let locationInstance = {
    'description': 'stuff here',
    'streetAddress': 'unknown st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  this.document.addItem(locationInstance);

  let result = this.document.toJSON();

  assert.deepEqual(result, [locationInstance]);
});

skip('throw an error if calling `toJSON` when required fields are not specified');
skip('handle array properties (where you have many of a given item)');
skip('add validations when setting property types');
