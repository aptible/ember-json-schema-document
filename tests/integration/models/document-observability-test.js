import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema/models/schema';
import schemaFixture from '../../fixtures/default-nested-property-schema';
import arrayBaseObjectFixture from '../../fixtures/location-schema';
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
