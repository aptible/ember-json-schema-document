import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema/models/schema';
import hbs from 'htmlbars-inline-precompile';

let stateProperty = {
  'id': 'http://jsonschema.net/0/state',
  'type': 'string',
  'default': 'NY',
  'enum': ['RI', 'NY', 'IN', 'CA', 'UT', 'CO'],
  'title': 'State'
};

let arraySchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'array',
  'items': {
    'id': 'http://jsonschema.net/0',
    'type': 'object',
    'properties': {
      'state': stateProperty
    },
    'required': [
      'state'
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
    'state': stateProperty,
    'address': {
      'id': 'http://jsonschema.net/address',
      'type': 'object',
      'properties': {
        'state': stateProperty
      },
      'required': [
        'state'
      ]
    }
  },
  'required': [
    'state'
  ]
};

let disabledPropertySchema = {
  'type': 'object',
  'properties': {
    'state': {
      'default': 'IN',
      'type': 'string',
      'enum': ['RI', 'NY', 'IN', 'CA', 'UT', 'CO'],
      'title': 'State',
      'readonly': true
    }
  }
};

moduleForComponent('schema-field-select', {
  integration: true,

  beforeEach() {
    this.key = 'state';

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
    this.nestedKey = 'address.state';
    this.nestedProperty = this.objectProperties.address.properties.state;
  }
});

// Test group 1: Adding item to array-base document

test('Array document: has a select element with options', function(assert) {
  let newItem = this.arrayDocument.addItem();

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-select key=key property=property document=newItem}}'));

  assert.equal(this.$('select[name="state"]').length, 1, 'has a select element');
  assert.equal(this.$('select option').length, 6, 'has all 6 options');
});

test('Array document: uses existing document value if present', function(assert) {
  let newItem = this.arrayDocument.addItem();
  newItem.set('state', 'NY');

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-select key=key property=property document=newItem}}'));

  let select = this.$('select');

  assert.equal(select.val(), newItem.get(this.key), 'documents current value used as default');
});

test('Array document: uses default value if present', function(assert) {
  let newItem = this.arrayDocument.addItem();
  let defaultValue = 'NY';

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-select key=key property=property document=newItem}}'));

  let select = this.$('select');
  assert.equal(select.val(), defaultValue);
});

test('Array document: updates document when changed', function(assert) {
  let newItem = this.arrayDocument.addItem();
  let expected = 'IN';

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-select key=key property=property document=newItem}}'));

  let select = this.$('select');

  assert.equal(select.val(), 'NY', 'initial value is correct');

  select.val(expected);
  select.trigger('change');

  assert.equal(newItem.get(this.key), expected);
});

// Test group 2: Root property in object-base document

test('Object document root property: has a select element with options', function(assert) {
  this.setProperties({ key: this.key, property: this.objectProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  assert.equal(this.$('select[name="state"]').length, 1, 'has a select element');
  assert.equal(this.$('select option').length, 6, 'has all 6 options');
});

test('Object document root property: uses existing document value if present', function(assert) {
  this.objectDocument.set(this.key, 'RI');

  this.setProperties({ key: this.key, property: this.objectProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  let select = this.$('select');

  assert.equal(select.val(), this.objectDocument.get(this.key), 'documents current value used as default');
});

test('Object document root property: uses default value if present', function(assert) {
  let defaultValue = 'NY';

  this.setProperties({ key: this.key, property: this.objectProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  let select = this.$('select');
  assert.equal(select.val(), defaultValue);
});

test('Object document root property: updates document when changed', function(assert) {
  let expected = 'IN';

  this.setProperties({ key: this.key, property: this.objectProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  let select = this.$('select');

  assert.equal(select.val(), 'NY', 'initial value is correct');

  select.val(expected);
  select.trigger('change');

  assert.equal(this.objectDocument.get(this.key), expected);
});

// Test group 3: Nested property in object-base document

test('Object document nested property: has a select element with options', function(assert) {
  this.setProperties({ key: this.nestedKey, property: this.nestedProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  assert.equal(this.$('select[name="address.state"]').length, 1, 'has a select element');
  assert.equal(this.$('select option').length, 6, 'has all 6 options');
});

test('Object document nested property: uses existing document value if present', function(assert) {
  this.objectDocument.set(this.nestedKey, 'RI');

  this.setProperties({ key: this.nestedKey, property: this.nestedProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  let select = this.$('select');

  assert.equal(select.val(), this.objectDocument.get(this.nestedKey), 'documents current value used as default');
});

test('Object document nested property: uses default value if present', function(assert) {
  let defaultValue = 'NY';

  this.setProperties({ key: this.nestedKey, property: this.nestedProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  let select = this.$('select');
  assert.equal(select.val(), defaultValue);
});

test('Object document nested property: updates document when changed', function(assert) {
  let expected = 'IN';

  this.setProperties({ key: this.nestedKey, property: this.nestedProperty,
                       document: this.objectDocument });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  let select = this.$('select');

  assert.equal(select.val(), 'NY', 'initial value is correct');

  select.val(expected);
  select.trigger('change');

  assert.equal(this.objectDocument.get(this.nestedKey), expected);
});

test('When `readonly` is true, select should be disabled', function(assert) {
  let schema = new Schema(disabledPropertySchema);
  let document = schema.buildDocument();
  let property = schema.properties.state;

  this.setProperties({ key: 'state', property, document });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  let select = this.$('select');
  assert.ok(select.is(':disabled'), 'select is disabled');
  assert.equal(select.val(), 'IN', 'default value is used in select');
  assert.equal(document.get('state'), 'IN', 'document value is correct');
});

test('When `readonly` is false, select should not be disabled', function(assert) {
  let schemaProperty = Ember.$.extend(true, {}, disabledPropertySchema);
  schemaProperty.properties.state.readonly = false;
  let schema = new Schema(schemaProperty);
  let document = schema.buildDocument();
  let property = schema.properties.state;

  this.setProperties({ key: 'state', property, document });
  this.render(hbs('{{schema-field-select key=key property=property document=document}}'));

  let select = this.$('select');
  assert.ok(!select.is(':disabled'), 'select is not disabled');
  assert.equal(select.val(), 'IN', 'default value is used in select');
  assert.equal(document.get('state'), 'IN', 'document value is correct');
});