import Property from 'ember-json-schema-document/models/property';

import { module, test } from 'qunit';

export const orderFixture = {
  'id': 'http://jsonschema.net/order',
  'type': 'object',
  'properties': {
    'name': { 'type': 'string' },
    'email': { 'type': 'string' },
    'shippingAddress': {
      'type': 'object',
      'dependencies': {
        'useAlternateShippingAddress': ['streetAddress', 'city', 'state']
      },
      'required': ['useAlternateShippingAddress'],
      'properties': {
        'useAlternateShippingAddress': {
          'type': 'boolean'
        },
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
      }
    },

    'billingAddress': {
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
      'required': [ 'streetAddress','city', 'state' ]
    }
  }
};

let property;
module('models/property', {
  beforeEach() {
    property = new Property(orderFixture);
  }
});

test('`dependencies` returns hash of property dependencies', function(assert) {
  let expectedDependencies = {
    useAlternateShippingAddress: ['streetAddress', 'city', 'state']
  };

  assert.deepEqual(property.dependencies, {}, 'root object has no dependencies');
  assert.deepEqual(property.getChildProperty('shippingAddress').dependencies,
                   expectedDependencies, 'shipping address has dependencies');
});

test('`parentProperty` returns property\'s parent property', function(assert) {
  assert.deepEqual(property.parentProperty, undefined, 'root has no parent property');
  assert.deepEqual(property.getChildProperty('shippingAddress').parentProperty,
                   property, 'shipping address `parentProperty` is root property');
});

test('`hasParentProperty` returns true for non-root property', function(assert) {
  assert.equal(property.hasParentProperty, false, 'root has no parent property');
  assert.equal(property.getChildProperty('shippingAddress').hasParentProperty,
                   true, 'shipping address has a parent property');
});

test('`key` returns property key', function(assert) {
  let childProp = property.getChildProperty('shippingAddress');
  let grandChildProp = childProp.getChildProperty('city');
  assert.equal(property.key, undefined, 'root property has no key');
  assert.equal(childProp.key, 'shippingAddress', 'returns correct key');
  assert.equal(grandChildProp.key, 'city', 'returns correct key');
});

test('`dependsOnProperties` returns the properties that depend on this property', function(assert) {
  let child = property.getChildProperty('shippingAddress');
  let master = child.getChildProperty('useAlternateShippingAddress');
  let dependent = child.getChildProperty('city');

  assert.deepEqual(dependent.dependsOnProperties, [master], 'master is included in dependsOnProperties list');
});

test('`isDependentProperty` returns true for properties that depend on other properties', function(assert) {
  let child = property.getChildProperty('shippingAddress');
  let dependent = child.getChildProperty('city');

  assert.equal(dependent.isDependentProperty, true, 'returns true when property depends on another property');
});

test('`dependentProperties` returns properties that depend on this property', function(assert) {
  let child = property.getChildProperty('shippingAddress');
  let master = child.getChildProperty('useAlternateShippingAddress');
  let dependents = [child.getChildProperty('streetAddress'), child.getChildProperty('city'),
                    child.getChildProperty('state')];
  assert.deepEqual(master.dependentProperties, dependents, 'includes dependent properties');
});

test('`hasDependentProperties` returns true if properties depend on this property', function(assert) {
  let child = property.getChildProperty('shippingAddress');
  let master = child.getChildProperty('useAlternateShippingAddress');

  assert.equal(master.hasDependentProperties, true, 'is true when dependent properties exist');
});

test('`documentPath` returns the full property path', function(assert) {
  let child = property.getChildProperty('shippingAddress');
  let grandChild = child.getChildProperty('city');

  assert.equal(child.documentPath, 'shippingAddress', 'first level');
  assert.equal(grandChild.documentPath, 'shippingAddress.city', 'nth level');
});
