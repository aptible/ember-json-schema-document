export default {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'array',
  'items': {
    'id': 'http://jsonschema.net/0',
    'type': 'object',
    'properties': {
      'description': {
        'id': 'http://jsonschema.net/0/description',
        'type': 'string'
      },
      'streetAddress': {
        'id': 'http://jsonschema.net/0/streetAddress',
        'type': 'string'
      },
      'city': {
        'id': 'http://jsonschema.net/0/city',
        'type': 'string'
      },
      'state': {
        'id': 'http://jsonschema.net/0/state',
        'type': 'string'
      },
      'zip': {
        'id': 'http://jsonschema.net/0/zip',
        'type': 'string'
      }
    },
    'required': [
      'description',
      'streetAddress',
      'city',
      'state',
      'zip'
    ]
  },
  'required': [
    '0'
  ]
};
