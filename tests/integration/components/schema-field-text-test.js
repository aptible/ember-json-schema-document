import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema/models/schema';
import hbs from 'htmlbars-inline-precompile';

let arraySchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'array',
  'items': {
    'id': 'http://jsonschema.net/0',
    'type': 'object',
    'properties': {
      'description': {
        'id': 'http://jsonschema.net/0/description',
        'default': 'Headquarters',
        'type': 'string',
        'title': 'Description',
        'displayProperties': {
          'placeholder': 'e.g. Headquarters'
        }
      }
    },
    'required': [
      'description'
    ]
  },
  'required': [
    '0'
  ]
};

let objectSchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'object',
  'properties': {
    'description': {
      'id': 'http://jsonschema.net/description',
      'default': 'Headquarters',
      'type': 'string',
      'title': 'Description'
    },
    'address': {
      'id': 'http://jsonschema.net/address',
      'type': 'object',
      'properties': {
        'city': {
          'id': 'http://jsonschema.net/address/city',
          'type': 'string',
          'default': 'Brooklyn',
          'title': 'City'
        }
      },
      'required': [
        'city'
      ]
    }
  },
  'required': [
    'description'
  ]
};

let disabledPropertySchema = {
  'type': 'object',
  'properties': {
    'description': {
      'id': 'http://jsonschema.net/description',
      'default': 'Headquarters',
      'type': 'string',
      'readonly': true,
      'title': 'Description'
    }
  }
};

moduleForComponent('schema-field-text', {
  integration: true,

  beforeEach() {
    this.key = 'description';

    // Test group 1: Array-base schema
    this.arraySchema = new Schema(arraySchema);
    this.arrayDocument = this.arraySchema.buildDocument();
    this.arrayProperties = this.arraySchema.itemProperties;
    this.arrayProperty = this.arrayProperties[this.key];

    // Test group 2: Object-base schema root property
    this.objectSchema = new Schema(objectSchema);
    this.objectDocument = this.objectSchema.buildDocument();
    this.objectProperties = this.objectSchema.properties;
    this.objectProperty = this.objectProperties[this.key];

    // Test group 3: Object-base schema, nested property
    this.nestedKey = 'address.city';
    this.nestedProperty = this.objectProperties.address.properties.city;
  }
});

// Test group 1: Adding item to array-base document

test('Array document: has a text field with a placeholder', function(assert) {
  let newItem = this.arrayDocument.addItem();

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-text key=key property=property document=newItem}}'));

  assert.ok(this.$('input[name="description"][type="text"]').length,
            'has a text field');
  assert.equal(this.$('input[name="description"][type="text"]:first').attr('placeholder'),
              'e.g. Headquarters',
              'has a placeholder');
});

test('Array document: uses existing document value if present', function(assert) {
  let newItem = this.arrayDocument.addItem();
  newItem.set('description', 'Existing description');

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-text key=key property=property document=newItem}}'));

  assert.equal(this.$('input[type="text"]').val(), newItem.get('description'));
});

test('Array document: uses default value if present', function(assert) {
  let newItem = this.arrayDocument.addItem();
  let defaultValue = 'Headquarters';

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-text key=key property=property document=newItem}}'));

  assert.equal(this.$('input[type="text"]').val(), defaultValue);
});

test('Array document: updates document when changed', function(assert) {
  let newItem = this.arrayDocument.addItem();
  let expected = 'New value';

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-text key=key property=property document=newItem}}'));

  let input = this.$('input[type="text"]');

  input.val(expected);
  input.trigger('input');

  assert.equal(newItem.get(this.key), expected, 'new document value is correct');
});

// Test group 2: Root property in object-base document

test('Object document: has a text field', function(assert) {
  this.setProperties({ key: this.key, property: this.objectProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  assert.ok(this.$('input[name="description"][type="text"]').length, 'has a text field');
});

test('Object document: uses existing document value if present', function(assert) {
  this.objectDocument.set(this.key, 'Existing description');

  this.setProperties({ key: this.key, property: this.objectProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  assert.equal(this.$('input[type="text"]').val(), this.objectDocument.get('description'));
});

test('Object document: uses default value if present', function(assert) {
  let defaultValue = 'Headquarters';

  this.setProperties({ key: this.key, property: this.objectProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  assert.equal(this.$('input[type="text"]').val(), defaultValue);
});

test('Object document: updates document when changed', function(assert) {
  let expected = 'New value';

  this.setProperties({ key: this.key, property: this.objectProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  let input = this.$('input[type="text"]');

  input.val(expected);
  input.trigger('input');

  assert.equal(this.objectDocument.get(this.key), expected, 'new document value is correct');
});

// Test group 3: Nested property in object-base document

test('Object document nested property: has a text field', function(assert) {
  this.setProperties({ key: this.nestedKey, property: this.nestedProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  assert.ok(this.$('input[name="address.city"][type="text"]').length, 'has a text field');
});

test('Object document nested property: uses existing document value if present', function(assert) {
  this.objectDocument.set(this.nestedKey, 'NYC');

  this.setProperties({ key: this.nestedKey, property: this.nestedProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  assert.equal(this.$('input[type="text"]').val(), this.objectDocument.get(this.nestedKey));
});

test('Object document nested property: uses default value if present', function(assert) {
  let defaultValue = 'Brooklyn';

  this.setProperties({ key: this.nestedKey, property: this.nestedProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  assert.equal(this.$('input[type="text"]').val(), defaultValue);
});

test('Object document nested property: updates document when changed', function(assert) {
  let expected = 'New value';

  this.setProperties({ key: this.nestedKey, property: this.nestedProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  let input = this.$('input[type="text"]');

  input.val(expected);
  input.trigger('input');

  assert.equal(this.objectDocument.get(this.nestedKey), expected, 'new document value is correct');
});

test('When `readonly` is true, text field should be disabled', function(assert) {
  let schema = new Schema(disabledPropertySchema);
  let document = schema.buildDocument();
  let property = schema.properties.description;

  this.setProperties({ key: 'description', property, document });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  let input = this.$('input[type="text"]');
  assert.ok(input.is(':disabled'), 'input is disabled');
  assert.equal(input.val(), 'Headquarters', 'default value is used in input');
  assert.equal(document.get('description'), 'Headquarters', 'document value is correct');
});

test('When `readonly` is false, text field should not disabled', function(assert) {
  let propertySchema = Ember.$.extend(true, {}, disabledPropertySchema);
  propertySchema.properties.description.readonly = false;
  let schema = new Schema(propertySchema);
  let document = schema.buildDocument();
  let property = schema.properties.description;

  this.setProperties({ key: 'description', property, document });
  this.render(hbs('{{schema-field-text key=key property=property document=document}}'));

  let input = this.$('input[type="text"]');
  assert.ok(!input.is(':disabled'), 'input is not disabled');
  assert.equal(input.val(), 'Headquarters', 'default value is used in input');
  assert.equal(document.get('description'), 'Headquarters', 'document value is correct');
});

