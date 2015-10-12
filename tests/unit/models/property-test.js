import Property from 'little-bobby/models/property';
import { module, test, skip } from 'qunit';

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
  }, /You must provide a property definition to the Property constructor./);
});

test('accessing properties returns a list of properties', function(assert) {
  let propertyKeys = Object.keys(property.properties);

  assert.deepEqual(['streetAddress', 'city'], propertyKeys, 'known keys are present');
});

test('accessing properties returns an instance of `Property` model', function(assert) {
  assert.ok(property.properties.streetAddress instanceof Property, 'streetAddress is an instance of Property');
  assert.ok(property.properties.city instanceof Property, 'city is an instance of Property');

  assert.equal(property.properties.streetAddress.type, 'string');
  assert.equal(property.properties.city.type, 'string');
});

skip('accessing properties for non-array and non-object property should throw a helpful error');
