import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('each-property', {
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);
  let component = this.subject({ properties: {} });

  assert.equal(component._state, 'preRender');

  this.render();

  assert.equal(component._state, 'inDOM');
});

test('it converts property hash into propertyCollection', function(assert) {
  let properties = {
    state: { type: 'string' },
    city: { type: 'string' },
    zip: { type: 'string' }
  };

  let component = this.subject({ properties });
  let propertyCollection = component.get('propertyCollection');

  assert.ok(Array.isArray(propertyCollection), 'is an array');
  assert.equal(propertyCollection.length, 3, 'has 3 items');
  assert.equal(propertyCollection[0].key, 'state', 'properties include a key');
  assert.equal(propertyCollection[0].property.type, 'string', 'properties include a property');
  assert.equal(propertyCollection[0].type, 'text', 'properties include a type');
});
