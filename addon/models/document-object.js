import Ember from 'ember';

export default Ember.Object.extend({
  _attrs: {},
  serialize() {
    let newAttrs = {};
    let excludeMatch = /^_/ig;

    for (let key in this) {
      if (this.hasOwnProperty(key) && !excludeMatch.test(key)) {
        let val = this[key];

        if (typeof val.serialize === 'function') {
          val = val.serialize();
        }

        newAttrs[key] = val;
      }
    }

    this._attrs = newAttrs;
    return this._attrs;
  }
});