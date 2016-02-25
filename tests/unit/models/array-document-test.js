import Schema from 'ember-json-schema-document/models/schema';
import { module, test } from 'qunit';
import arrayBaseObjectFixture from '../../fixtures/location-schema';

module('models/document', {
  beforeEach() {
    this.count = 0;
    this.schema = new Schema(arrayBaseObjectFixture);
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
      'state': 'RI',
      'zip': `${++this.count}${++this.count}${++this.count}${++this.count}${++this.count}`
    };
  }
});

test('add array as base object type using per-property syntax', function(assert) {
  let expected = this.buildLocation();

  let item = this.document.addItem();
  this.populateDocument(item, expected);

  let result = this.document.dump();

  assert.deepEqual(result, [expected]);
});

test('`dump` with `excludeInvalid` should only include valid items', function(assert) {
  let valid = this.buildLocation();

  this.document.addItem(valid);
  this.document.addItem();

  let result = this.document.dump({ excludeInvalid: true });

  assert.deepEqual(result, [valid]);
});

test('can add multiple items to an array based document using per-property syntax', function(assert) {
  let expected1 = this.buildLocation();
  let expected2 = this.buildLocation();

  this.populateDocument(this.document.addItem(), expected1);
  this.populateDocument(this.document.addItem(), expected2);

  let result = this.document.dump();

  assert.deepEqual(result, [expected1, expected2]);
});

test('can access the backing document for array items after initial creation', function(assert) {
  let item1 = this.document.addItem();
  let item2 = this.document.getItem(0);

  assert.equal(item1, item2, 'items added with addItem can be retrieved');
});

test('can access all items after creation', function(assert) {
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
  let expected1 = this.buildLocation();
  let expected2 = this.buildLocation();

  let item1 = this.document.addItem();
  let item2 = this.document.addItem();

  this.populateDocument(item1, expected1);
  this.populateDocument(item2, expected2);

  let result = this.document.dump();

  assert.deepEqual(result, [expected1, expected2]);

  this.document.removeItem(1);

  result = this.document.dump();
  assert.deepEqual(result, [expected1]);
});

test('can remove an item by reference from an array based document', function(assert) {
  let expected1 = this.buildLocation();
  let expected2 = this.buildLocation();

  let item1 = this.document.addItem();
  let item2 = this.document.addItem();

  this.populateDocument(item1, expected1);
  this.populateDocument(item2, expected2);

  let result = this.document.dump();

  assert.deepEqual(result, [expected1, expected2]);

  this.document.removeObject(item1);
  result = this.document.dump();
  assert.deepEqual(result, [expected2]);
});

test('exposes a `load` method', function(assert) {
  let input = [this.buildLocation(), this.buildLocation()];

  this.document.load(input);

  let result = this.document.dump();

  assert.deepEqual(input, result);
});
