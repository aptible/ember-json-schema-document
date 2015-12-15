import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema/models/schema';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

let isDeveloperProperty = {
  'id': 'http://jsonschema.net/0/is-developer',
  'type': 'boolean',
  'default': false,
  'displayProperties': {
    'title': 'Is Developer',
    'toggleSize': 'small',
    'showLabels': true,
    'useToggle': true,
    'labels': {
      'trueLabel': 'Confirm',
      'falseLabel': 'Deny'
    }
  }
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
      'title': 'Is Developer',
      'readonly': true,
      'displayProperties': {
        'toggleSize': 'small',
        'showLabels': true,
        'useToggle': true,
        'labels': {
          'trueLabel': 'Yes',
          'falseLabel': 'No'
        }
      }
    }
  }
};

moduleForComponent('schema-field-toggle', {
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

test('Array document: has a toggle element with labels', function(assert) {
  let newItem = this.arrayDocument.addItem();

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-toggle key=key property=property document=newItem}}'));

  assert.ok(this.$('.toggle-prefix:contains(Deny)').length, 'Has a false label');
  assert.ok(this.$('.toggle-postfix:contains(Confirm)').length, 'Has a true label');

  let toggle = this.$('.x-toggle-btn');
  assert.ok(toggle.length, 'has a toggle button');
  toggle.click();

  assert.ok(this.$('.x-toggle-container').hasClass('x-toggle-container-checked'), 'Clicking toggle changes state to checked');
});

test('Array document: uses existing document value if present', function(assert) {
  let newItem = this.arrayDocument.addItem();
  newItem.set('developer', true);

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-toggle key=key property=property document=newItem}}'));

  assert.ok(this.$('.x-toggle-container').hasClass('x-toggle-container-checked'), 'Toggle is currently selected');
});

test('Array document: uses default value if present', function(assert) {
  let newItem = this.arrayDocument.addItem();
  let defaultValue = false;

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-toggle key=key property=property document=newItem}}'));

  assert.equal(this.$('.x-toggle-container').hasClass('x-toggle-container-checked'), defaultValue, 'Toggle is not selected');
});

test('Array document: updates document when changed', function(assert) {
  let newItem = this.arrayDocument.addItem();
  let expected = true;

  this.setProperties({ key: this.key, property: this.arrayProperty, newItem });
  this.render(hbs('{{schema-field-toggle key=key property=property document=newItem}}'));

  assert.equal(this.$('.x-toggle-container').hasClass('x-toggle-container-checked'), false, 'Toggle is not selected');

  this.$('.x-toggle-btn').click();

  assert.equal(newItem.get(this.key), expected);
});

test('Toggle with disabled labels shouldn\'t show labels', function(assert) {
  let obj = Ember.$.extend(true, {}, isDeveloperProperty);
  obj.displayProperties.showLabels = false;
  let schemaJSON = { 'type': 'object', 'properties': { 'developer': obj } };
  let schema = new Schema(schemaJSON);
  let doc = schema.buildDocument();
  let property = schema.properties.developer;
  let key = 'developer';

  this.setProperties({ schema, doc, property, key });
  this.render(hbs('{{schema-field-toggle key=key property=property document=doc}}'));

  assert.equal(this.$('.toggle-prefix:contains(Deny)').length, 0, 'Has no false label');
  assert.equal(this.$('.toggle-postfix:contains(Confirm)').length, 0, 'Has no true label');
});

test('Toggle with custom labels', function(assert) {
  let obj = Ember.$.extend(true, {}, isDeveloperProperty);
  obj.displayProperties.showLabels = true;
  obj.displayProperties.labels.trueLabel = 'Enabled';
  obj.displayProperties.labels.falseLabel = 'Disabled';
  let schemaJSON = { 'type': 'object', 'properties': { 'developer': obj } };
  let schema = new Schema(schemaJSON);
  let doc = schema.buildDocument();
  let property = schema.properties.developer;
  let key = 'developer';

  this.setProperties({ schema, doc, property, key });
  this.render(hbs('{{schema-field-toggle key=key property=property document=doc}}'));

  assert.equal(this.$('.toggle-prefix:contains(Disabled)').length, 1, 'Has enabled label');
  assert.equal(this.$('.toggle-postfix:contains(Enabled)').length, 1, 'Has disabled label');
});

test('Toggle default labels', function(assert) {
  let obj = Ember.$.extend(true, {}, isDeveloperProperty);
  obj.displayProperties.showLabels = true;
  obj.displayProperties.labels = undefined;
  let schemaJSON = { 'type': 'object', 'properties': { 'developer': obj } };
  let schema = new Schema(schemaJSON);
  let doc = schema.buildDocument();
  let property = schema.properties.developer;
  let key = 'developer';

  this.setProperties({ schema, doc, property, key });
  this.render(hbs('{{schema-field-toggle key=key property=property document=doc}}'));

  assert.equal(this.$('.toggle-prefix:contains(False)').length, 1, 'Has True label');
  assert.equal(this.$('.toggle-postfix:contains(True)').length, 1, 'Has False label');
});

test('When `readonly` is true, toggle should be disabled', function(assert) {
  let schema = new Schema(disabledPropertySchema);
  let document = schema.buildDocument();
  let property = schema.properties.developer;

  this.setProperties({ key: 'developer', property, document });
  this.render(hbs('{{schema-field-toggle key=key property=property document=document}}'));

  let toggle = this.$('.x-toggle-container');
  assert.ok(toggle.hasClass('x-toggle-container-disabled'), 'toggle is disabled');
  assert.ok(toggle.hasClass('x-toggle-container-checked'), 'default value is used');
  assert.equal(document.get('developer'), true, 'document value is correct');
});

test('When `readonly` is false, toggle should not be disabled', function(assert) {
  let schemaProperty = Ember.$.extend(true, {}, disabledPropertySchema);
  schemaProperty.properties.developer.readonly = false;
  let schema = new Schema(schemaProperty);
  let document = schema.buildDocument();
  let property = schema.properties.developer;

  this.setProperties({ key: 'developer', property, document });
  this.render(hbs('{{schema-field-toggle key=key property=property document=document}}'));

  let toggle = this.$('.x-toggle-container');
  assert.ok(!toggle.hasClass('x-toggle-container-disabled'), 'toggle is not disabled');
  assert.ok(toggle.hasClass('x-toggle-container-checked'), 'default value is used');
  assert.equal(document.get('developer'), true, 'document value is correct');
});