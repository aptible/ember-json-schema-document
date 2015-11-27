// inspired by https://github.com/acornejo/jjv/blob/master/test/fixtures/ref.json

export default {
  'type': 'object',
  'definitions': {
    'text': {
      'type': 'string'
    },
    'nestedvalue': {
      'type': 'object',
      'properties': {
        'key': {
          '$ref': '#/definitions/text'
        },
        'value': {
          '$ref': '#/definitions/nestedvalue'
        },
        'required': [
          'key'
        ]
      }
    }
  },
  'properties': {
    'str': {
      '$ref': '#/definitions/text'
    },
    'nested': {
      '$ref': '#/definitions/nestedvalue'
    }
  }
};