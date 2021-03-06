import Property from 'ember-json-schema-document/models/property';

import { module, test } from 'qunit';

export const propertyFixture = {
  'id': 'http://jsonschema.net/address',
  'type': 'object',
  'properties': {
    'streetAddress': {
      'id': 'http://jsonschema.net/address/streetAddress',
      'type': 'string'
    },
    'city': {
      'id': 'http://jsonschema.net/address/city',
      'type': 'string'
    },
    'state': {
      'id': 'http://jsonschema.net/address/city',
      'type': 'string',
      'enum': ['NY', 'IN']
    }
  },
  'required': [
    'streetAddress',
    'city'
  ]
};

let property;
module('models/property', {
  beforeEach() {
    property = new Property(propertyFixture);
  }
});

test('accepts a property definition to constructor', function(assert) {
  assert.ok(property, 'can create a property');
  assert.equal(property._property, propertyFixture, 'keeps track of raw property');
});

test('throws an error if schema is not provided to constructor', function(assert) {
  assert.throws(function() {
    new Property();
  }, /You must provide a property definition to the `Property` constructor./);
});

test('throws an error if parent property is supplised without a key', function(assert) {
  assert.throws(function() {
    new Property({ type: 'object', properties: {} }, { type: 'object' });
  }, /You must provide a property `key` to the `Property` constructor when a `parentProperty` exists./);
});

test('accessing properties returns a list of properties', function(assert) {
  let propertyKeys = Object.keys(property.properties);

  assert.deepEqual(['streetAddress', 'city', 'state'], propertyKeys, 'known keys are present');
});

test('`getChildProperty` return child property by key', function(assert) {
  assert.deepEqual(property.getChildProperty('state').validValues, ['NY', 'IN'], 'correct property is returned');
});

test('accessing properties returns an instance of `Property` model', function(assert) {
  assert.ok(property.properties.streetAddress instanceof Property, 'streetAddress is an instance of Property');
  assert.ok(property.properties.city instanceof Property, 'city is an instance of Property');

  assert.equal(property.properties.streetAddress.type, 'string');
  assert.equal(property.properties.city.type, 'string');
});

test('can create a default value for an object', function(assert) {
  assert.deepEqual(property.buildDefaultValue().serialize(), {}, 'defaultValue returns an object if property type is object');
});

test('can create a default value for an object', function(assert) {
  property = new Property({
    'id': 'http://jsonschema.net/address/streetAddress',
    'type': 'array',
    'items': {
      type: 'object',
      properties: { }
    }
  });

  assert.deepEqual(property.buildDefaultValue(), [], 'defaultValue returns an array if property type is array');
});

test('sets to undefined when attempting to build default for non array/object types', function(assert) {
  property = new Property({
    'id': 'http://jsonschema.net/address/streetAddress',
    'type': 'string'
  });

  assert.equal(property.buildDefaultValue(), undefined, 'uses undefined for non array/object properties');
});

test('calling .properties when none exist returns null', function(assert) {
  property = new Property({
    'id': 'http://jsonschema.net/address/streetAddress',
    'type': 'string'
  });

  assert.notOk(property.properties, 'returns falsey value when nested properties do not exist');
});

test('exposes `enum` property as `validValues`', function(assert) {
  let values = [ 'foo', 'bar', 1, 2, 3];

  property = new Property({
    'type': 'string',
    'enum': values.slice()
  });

  assert.deepEqual(property.validValues, values, 'listed enum was available as `validValues`');
});

test('exposes `displayProperties`', function(assert) {
  property = new Property({
    'type': 'string',
    'displayProperties': {
      'placeholder': 'e.g. Sean Connery',
      'prompt': 'Select a contestant'
    }
  });

  assert.equal(property.displayProperties.placeholder, 'e.g. Sean Connery', '`placeholder` returns placeholder');
  assert.equal(property.displayProperties.prompt, 'Select a contestant', '`prompt` returns property prompt');
});

test('exposes `default`', function(assert) {
  property = new Property({
    'type': 'string',
    'default': 'Turd Ferguson'
  });

  assert.equal(property.default, 'Turd Ferguson', '`default` returns default value');
});

test('exposes `title` and `description`', function(assert) {
  property = new Property({
    'type': 'string',
    'title': 'Contestant Name',
    'description': 'Which contestant is your favorite?'
  });

  assert.equal(property.title, 'Contestant Name', '`title` returns property title');
  assert.equal(property.description, 'Which contestant is your favorite?', '`description` returns property description');
});

test('exposes `readonly` when true', function(assert) {
  property = new Property({
    'type': 'string',
    'default': 'Turd Ferguson',
    'readonly': true
  });

  assert.equal(property.readonly, true, '`readonly` returns true when set');
});

test('`readonly` returns false when undefined in schema', function(assert) {
  property = new Property({
    'type': 'string',
    'default': 'Turd Ferguson'
  });

  assert.equal(property.readonly, false, '`readonly` returns false when undefined');
});
