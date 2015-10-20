import Ember from 'ember';

export default function buildDefaultValueForType(type) {
  switch (type) {
  case 'object': return Object.create(null);
  case 'array': return Ember.A();
  default:
    return undefined;
  }
}
