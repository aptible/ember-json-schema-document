import Schema from 'ember-json-schema/models/schema';
import Document from 'ember-json-schema/models/document';
import { module, test, skip } from 'qunit';
import schemaFixture from '../../fixtures/default-nested-property-schema';
import arrayBaseObjectFixture from '../../fixtures/location-schema';

module('models/document', {
  beforeEach() {
    this.schema = new Schema(schemaFixture);
    this.document = this.schema.buildDocument();
  },

  populateDocument(...args) {
    let object = args.pop();
    let document = args.pop() || this.document;

    for (let key in object) {
      document.set(key, object[key]);
    }
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

test('add array as base object type using per-property syntax', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected = {
    'description': 'stuff here',
    'streetAddress': 'unknown st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let item = this.document.addItem();
  this.populateDocument(item, expected);

  let result = this.document.toJSON();

  assert.deepEqual(result, [expected]);
});

test('can add multiple items to an array based document using per-property syntax', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected1 = {
    'description': 'stuff here',
    'streetAddress': 'unknown st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let expected2 = {
    'description': 'other stuff here',
    'streetAddress': 'totally known st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  this.populateDocument(this.document.addItem(), expected1);
  this.populateDocument(this.document.addItem(), expected2);

  let result = this.document.toJSON();

  assert.deepEqual(result, [expected1, expected2]);
});

test('can access the backing document for array items after initial creation', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let item1 = this.document.addItem();
  let item2 = this.document.getItem(0);

  assert.equal(item1, item2, 'items added with addItem can be retrieved');
});

test('can access all items after creation', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected1 = {
    'description': 'stuff here',
    'streetAddress': 'unknown st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let expected2 = {
    'description': 'other stuff here',
    'streetAddress': 'totally known st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let item1 = this.document.addItem();
  let item2 = this.document.addItem();

  this.populateDocument(item1, expected1);
  this.populateDocument(item2, expected2);

  let result = this.document.allItems();

  assert.deepEqual(result, [item1, item2]);
});

test('can remove an item by index from an array based document', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected1 = {
    'description': 'stuff here',
    'streetAddress': 'unknown st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let expected2 = {
    'description': 'other stuff here',
    'streetAddress': 'totally known st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let item1 = this.document.addItem();
  let item2 = this.document.addItem();

  this.populateDocument(item1, expected1);
  this.populateDocument(item2, expected2);

  let result = this.document.toJSON();

  assert.deepEqual(result, [expected1, expected2]);

  this.document.removeItem(1);

  assert.deepEqual(result, [expected1]);
});

test('can remove an item by reference from an array based document', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected1 = {
    'description': 'stuff here',
    'streetAddress': 'unknown st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let expected2 = {
    'description': 'other stuff here',
    'streetAddress': 'totally known st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  let item1 = this.document.addItem();
  let item2 = this.document.addItem();

  this.populateDocument(item1, expected1);
  this.populateDocument(item2, expected2);

  let result = this.document.toJSON();

  assert.deepEqual(result, [expected1, expected2]);

  this.document.removeObject(item1);

  assert.deepEqual(result, [expected2]);
});

test('can get a list of validValues for a property', function(assert) {
  let expectedValues = schemaFixture.properties.address.properties.state.enum;

  assert.deepEqual(this.document.properties.address.properties.state.validValues, expectedValues);
  assert.deepEqual(this.document.validValuesFor('address.state'), expectedValues);

});

test('exposes underlying values in `.values`', function(assert) {
  this.document.set('description', 'awesome sauce');

  assert.equal(this.document.values.description, 'awesome sauce');
});

test('exposes `isValid` to determine if the full document is valid', function(assert) {
  assert.equal(this.document.isValid, false, 'document is not valid');

  this.document.set('phoneNumber', '1234567890');
  this.document.set('address.streetAddress', '1234 Nowhere St.');
  this.document.set('address.city', 'Hope');

  assert.equal(this.document.isValid, true, 'document is valid');
});

skip('throw an error if calling `toJSON` when required fields are not specified');
skip('handle array properties (where you have many of a given item)');
skip('add validations when setting property types');
