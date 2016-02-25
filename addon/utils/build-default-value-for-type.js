import Ember from 'ember';
import DocumentObject from '../models/document-object';

export default function buildDefaultValueForType(type) {
  switch (type) {
  case 'object': return DocumentObject.create({});
  case 'array': return Ember.A();
  default:
    return undefined;
  }
}
