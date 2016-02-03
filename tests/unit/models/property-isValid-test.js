import Property from 'ember-json-schema-document/models/property';
import { module, test } from 'qunit';

const personWithRequirements = {
  'type': 'object',
  'properties': {
    'first': {
      'type': 'string'
    },
    'last': {
      'type': 'string'
    }
  },
  required: [
    'first',
    'last'
  ]
};

const personWithNestedRequirements = {
  'type': 'object',
  'properties': {
    'first': {
      'type': 'string'
    },
    'last': {
      'type': 'string'
    },
    address: {
      type: 'object',
      properties: {
        city: { type: 'string' },
        zip: { type: 'string' },
        state: {
          type: 'string',
          enum: [
            'RI',
            'NY',
            'IN',
            'CA',
            'UT',
            'CO'
          ]
        }
      },
      required: [
        'city',
        'state',
        'zip'
      ]
    }
  },
  required: [
    'first',
    'last',
    'address'
  ]
};

module('models/property - isValid');

test('it is valid if no sub-properties are required', function(assert) {
  let property = new Property({
    'type': 'object',
    'properties': {
      'first': {
        'type': 'string'
      },
      'last': {
        'type': 'string'
      }
    }
  });

  assert.ok(property.isValid({}), 'is valid when no properties are required');
});

test('it is valid if all required sub-properties are present', function(assert) {
  let property = new Property(personWithRequirements);

  let person = {
    last: 'Jackson',
    first: 'James'
  };

  assert.ok(property.isValid(person), 'is valid when no properties are required');
});

test('it is invalid if required sub-properties are not present', function(assert) {
  let property = new Property(personWithRequirements);

  let person = {
    last: 'Jackson'
  };

  assert.notOk(property.isValid(person), 'is invalid when no required props are missing');
});

test('it is invalid if required sub-properties exist and null/undefined object is used', function(assert) {
  let property = new Property(personWithRequirements);

  assert.notOk(property.isValid(null), 'is invalid when required props are not present');
  assert.notOk(property.isValid(undefined), 'is invalid when required props are not present');
});

test('it is invalid if required nested sub-properties exist and are unsatisfied', function(assert) {
  let property = new Property(personWithNestedRequirements);

  let person = {
    last: 'Jackson',
    first: 'Max',
    address: { }
  };

  assert.notOk(property.isValid(person), 'is not valid when nested properties are not satisfied');
});

test('it is valid if required nested sub-properties exist are satisfied', function(assert) {
  let property = new Property(personWithNestedRequirements);

  let person = {
    last: 'Jackson',
    first: 'Max',
    address: {
      city: 'Hope',
      state: 'RI',
      zip: '02831'
    }
  };

  assert.ok(property.isValid(person), 'is valid when nested properties are satisfied');
});

test('it is invalid if required nested sub-properties do not match enum', function(assert) {
  let property = new Property(personWithNestedRequirements);

  let person = {
    last: 'Jackson',
    first: 'Max',
    address: {
      city: 'Ocala',
      state: 'FL',
      zip: '34471'
    }
  };

  assert.notOk(property.isValid(person), 'is invalid when value is not in enum');
});
