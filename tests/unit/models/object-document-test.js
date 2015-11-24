import Schema from 'ember-json-schema/models/schema';
import { module, test } from 'qunit';
import schemaFixture from '../../fixtures/default-nested-property-schema';

module('models/document - object', {
  beforeEach() {
    this.schema = new Schema(schemaFixture);
    this.document = this.schema.buildDocument();
  }
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

test('dump returns a object with values that were set', function(assert) {
  this.document.set('address.streetAddress', '123 Blah St.');
  this.document.set('address.city', 'Hope');

  // TODO: deal with phoneNumber array somehow

  let result = this.document.dump();

  assert.deepEqual(result, {
    address: {
      streetAddress: '123 Blah St.',
      city: 'Hope'
    }
  });
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

