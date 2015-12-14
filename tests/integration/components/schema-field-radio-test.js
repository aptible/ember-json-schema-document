import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema/models/schema';
import hbs from 'htmlbars-inline-precompile';

let isDeveloperProperty = {
  'id': 'http://jsonschema.net/0/is-developer',
  'type': 'boolean',
  'default': false,
  'title': 'Is Developer'
};

let arraySchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'array',
  'items': {
    'id': 'http://jsonschema.net/0',
    'type': 'object',
    'properties': {
      'developer': isDeveloperProperty
    },
    'required': [
      'developer'
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
    'developer': isDeveloperProperty,
    'securityOfficer': {
      'id': 'http://jsonschema.net/address',
      'type': 'object',
      'properties': {
        'developer': isDeveloperProperty
      },
      'required': [
        'developer'
      ]
    }
  },
  'required': [
    'developer'
  ]
};

let disabledPropertySchema = {
  'type': 'object',
  'properties': {
    'developer': {
      'default': true,
      'type': 'boolean',
      'readonly': true,
      'title': 'Is Developer'
    }
  }
};

moduleForComponent('schema-field-radio', {
  integration: true,

  beforeEach() {
    this.key = 'developer';

    // Test group 1: Array-base schema
    this.arraySchema = new Schema(arraySchema);
    this.arrayProperties = this.arraySchema.itemProperties;
    this.arrayDocument = this.arraySchema.buildDocument();
    this.arrayProperty = this.arrayProperties[this.key];

    // Test group 2: Object-base schema root property
    this.objectSchema = new Schema(objectSchema);
    this.objectDocument = this.objectSchema.buildDocument();
    this.objectProperties = this.objectSchema.properties;
    this.objectProperty = this.objectProperties[this.key];

    // Test group 3: Object-base schema nested property
    this.nestedKey = 'securityOfficer.developer';
    this.nestedProperty = this.objectProperties.securityOfficer.properties.developer;
  }
});

// Test group 1: Adding item to array-base document

test('Array document: has a radio elements', function(assert) {
  let newItem = this.arrayDocument.addItem();

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-radio key=key property=property document=newItem}}'));

  assert.equal(this.$('input[type="radio"][name="developer"]').length, 2, 'has two radio buttons');
});

test('Array document: uses existing document value if present', function(assert) {
  let newItem = this.arrayDocument.addItem();
  newItem.set('developer', true);

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-radio key=key property=property document=newItem}}'));

  let selectedRadio = this.$('input[type="radio"]:checked');

  assert.equal(JSON.parse(selectedRadio.val().toLowerCase()), newItem.get(this.key), 'documents current value used as default');
});

test('Array document: uses default value if present', function(assert) {
  let newItem = this.arrayDocument.addItem();
  let defaultValue = false;

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-radio key=key property=property document=newItem}}'));

  let selectedRadio = this.$('input[type="radio"]:checked');
  assert.equal(JSON.parse(selectedRadio.val().toLowerCase()), defaultValue);
});

test('Array document: updates document when changed', function(assert) {
  let newItem = this.arrayDocument.addItem();
  let expected = true;

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-radio key=key property=property document=newItem}}'));

  let selectedRadio = this.$('input[type="radio"]:checked');
  assert.equal(JSON.parse(selectedRadio.val().toLowerCase()), false, 'initial value is correct');

  this.$('input[type="radio"][value="true"]').click();

  assert.equal(newItem.get(this.key), expected);
});

test('When `readonly` is true, radios should be disabled', function(assert) {
  let schema = new Schema(disabledPropertySchema);
  let document = schema.buildDocument();
  let property = schema.properties.developer;

  this.setProperties({ key: 'developer', property, document });
  this.render(hbs('{{schema-field-radio key=key property=property document=document}}'));

  let trueInput = this.$('input[type="radio"][value="true"]');
  let falseInput = this.$('input[type="radio"][value="false"]');

  assert.ok(trueInput.is(':disabled'), 'true input is disabled');
  assert.ok(falseInput.is(':disabled'), 'false input is disabled');
  assert.ok(trueInput.is(':checked'), 'true input is checked by default');
  assert.ok(!falseInput.is(':checked'), 'false input is not checked by default');
  assert.equal(document.get('developer'), true, 'document value is correct');
});

test('When `readonly` is false, radios should not be disabled', function(assert) {
  let propertySchema = Ember.$.extend(true, {}, disabledPropertySchema);
  propertySchema.properties.developer.readonly = false;
  let schema = new Schema(propertySchema);
  let document = schema.buildDocument();
  let property = schema.properties.developer;

  this.setProperties({ key: 'developer', property, document });
  this.render(hbs('{{schema-field-radio key=key property=property document=document}}'));

  let trueInput = this.$('input[type="radio"][value="true"]');
  let falseInput = this.$('input[type="radio"][value="false"]');

  assert.ok(!trueInput.is(':disabled'), 'true input is not disabled');
  assert.ok(!falseInput.is(':disabled'), 'false input is not disabled');
  assert.ok(trueInput.is(':checked'), 'true input is checked by default');
  assert.ok(!falseInput.is(':checked'), 'false input is not checked by default');
  assert.equal(document.get('developer'), true, 'document value is correct');
});