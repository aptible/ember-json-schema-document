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
        'title': 'Description',
        'default': 'Headquarters',
        'type': 'string'
      },
      'streetAddress': {
        'id': 'http://jsonschema.net/0/streetAddress',
        'title': 'Address',
        'type': 'string'
      },
      'city': {
        'id': 'http://jsonschema.net/0/city',
        'title': 'City',
        'type': 'string'
      },
      'state': {
        'id': 'http://jsonschema.net/0/state',
        'title': 'State',
        'type': 'string',
        enum: ['RI', 'NY', 'IN', 'CA', 'UT', 'CO'],
        'default': 'NY'
      },
      'zip': {
        'id': 'http://jsonschema.net/0/zip',
        'title': 'Zip',
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
