export default {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'object',
  'properties': {
    'description': {
      'id': 'http://jsonschema.net/description',
      'type': 'string'
    },
    'address': {
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
          'id': 'http://jsonschema.net/address/state',
          'type': 'string',
          'enum': [ 'RI', 'NY', 'IN', 'CA', 'UT','CO' ]
        }
      },
      'required': [
        'streetAddress',
        'city'
      ]
    },
    'phoneNumber': {
      'id': 'http://jsonschema.net/phoneNumber',
      'type': 'array',
      'items': {
        'id': 'http://jsonschema.net/phoneNumber/0',
        'type': 'object',
        'properties': {
          'location': {
            'id': 'http://jsonschema.net/phoneNumber/0/location',
            'type': 'string'
          },
          'code': {
            'id': 'http://jsonschema.net/phoneNumber/0/code',
            'type': 'integer'
          }
        }
      }
    }
  },
  'required': [
    'address',
    'phoneNumber'
  ]
};
