import Schema from 'ember-json-schema/models/schema';
import Document from 'ember-json-schema/models/document';
import { module, test, skip } from 'qunit';
import schemaFixture from '../../fixtures/default-nested-property-schema';
import arrayBaseObjectFixture from '../../fixtures/location-schema';

module('models/document', {
  beforeEach() {
    this.count = 0;
    this.schema = new Schema(schemaFixture);
    this.document = this.schema.buildDocument();
  },

  populateDocument(...args) {
    let object = args.pop();
    let document = args.pop() || this.document;

    for (let key in object) {
      document.set(key, object[key]);
    }
  },

  buildLocation() {
    return {
      'description': `stuff here ${++this.count}`,
      'streetAddress': `${++this.count} unknown st`,
      'city': 'hope',
      'state': 'ri',
      'zip': `${++this.count}${++this.count}${++this.count}${++this.count}${++this.count}`
    };
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

test('add array as base object type using per-property syntax', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected = this.buildLocation();

  let item = this.document.addItem();
  this.populateDocument(item, expected);

  let result = this.document.dump();

  assert.deepEqual(result, [expected]);
});

test('can add multiple items to an array based document using per-property syntax', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected1 = this.buildLocation();
  let expected2 = this.buildLocation();

  this.populateDocument(this.document.addItem(), expected1);
  this.populateDocument(this.document.addItem(), expected2);

  let result = this.document.dump();

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

  let expected1 = this.buildLocation();
  let expected2 = this.buildLocation();

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

  let expected1 = this.buildLocation();
  let expected2 = this.buildLocation();

  let item1 = this.document.addItem();
  let item2 = this.document.addItem();

  this.populateDocument(item1, expected1);
  this.populateDocument(item2, expected2);

  let result = this.document.dump();

  assert.deepEqual(result, [expected1, expected2]);

  this.document.removeItem(1);

  assert.deepEqual(result, [expected1]);
});

test('can remove an item by reference from an array based document', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let expected1 = this.buildLocation();
  let expected2 = this.buildLocation();

  let item1 = this.document.addItem();
  let item2 = this.document.addItem();

  this.populateDocument(item1, expected1);
  this.populateDocument(item2, expected2);

  let result = this.document.dump();

  assert.deepEqual(result, [expected1, expected2]);

  this.document.removeObject(item1);

  assert.deepEqual(result, [expected2]);
});

skip('throw an error if calling `dump` when required fields are not specified');
skip('handle array properties (where you have many of a given item)');
skip('add validations when setting property types');
