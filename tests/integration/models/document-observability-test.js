import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema-document/models/schema';
import schemaFixture from '../../fixtures/default-nested-property-schema';
import arrayBaseObjectFixture from '../../fixtures/location-schema';
import refSchemaFixture from '../../fixtures/ref-schema';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('document observability', {
  integration: true,

  beforeEach() {
    this.schema = new Schema(schemaFixture);
    this.document = this.schema.buildDocument();
  }
});

test('can observe document properties', function(assert) {
  this.set('doc', this.document);

  this.document.set('address.city', 'Hope');

  this.render(hbs`{{doc.values.address.city}}`);

  assert.equal(this.$().text(), 'Hope');

  this.document.set('address.city', 'New York');

  assert.equal(this.$().text(), 'New York');
});

test('can observe array based document properties', function(assert) {
  this.schema = new Schema(arrayBaseObjectFixture);
  this.document = this.schema.buildDocument();

  let item;
  let expected1 = {
    'description': 'stuff here',
    'streetAddress': 'unknown st',
    'city': 'hope',
    'state': 'ri',
    'zip': '02831'
  };

  item = this.document.addItem();
  for (let key in expected1) {
    item.set(key, expected1[key]);
  }

  this.set('doc', this.document);

  this.render(hbs`{{#each doc.values as |item|}}{{item.values.city}}{{/each}}`);

  assert.equal(this.$().text(), 'hope', 'includes the correct initial value');

  let expected2 = {
    'description': 'other stuff here',
    'streetAddress': 'totally known st',
    'city': 'providence',
    'state': 'ri',
    'zip': '02831'
  };

  item = this.document.addItem();
  for (let key in expected2) {
    item.set(key, expected2[key]);
  }

  assert.equal(this.$().text(), 'hopeprovidence', 'adds new item value');
});

test('can observe referenced document properties', function(assert) {
  this.schema = new Schema(refSchemaFixture);

  let expected1 = {
    'str': 'test',
    'nested': {
      'value': {
        'value': {
          'key': 'depth3'
        }
      }
    }
  };
  this.document = this.schema.buildDocument(expected1);
  this.set('doc', this.document);

  this.render(hbs`{{doc.values.nested.value.value.key}}`);

  assert.equal(this.$().text(), 'depth3', 'renders the correct initial value');

  this.document.set('nested.value.value.key', 'DEPTH3');

  assert.equal(this.$().text(), 'DEPTH3', 'updates the value');
});
