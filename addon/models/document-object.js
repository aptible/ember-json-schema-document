import Ember from 'ember';

export default Ember.Object.extend({
  serialize() {
    return this.serializeHash(this);
  },

  serializeHash(hash) {
    let newAttrs = {};
    let excludeMatch = /^_/ig;

    for (let key in hash) {
      if (hash.hasOwnProperty(key) && !excludeMatch.test(key)) {
        let val = hash[key];

        if (typeof val === 'undefined' || val === null) {
          continue;
        }

        if (Array.isArray(val)) {
          val = val;
        } else if (typeof val === 'object') {
          val = this.serializeHash(val);
        } else if (typeof val.serialize === 'function') {
          val = val.serialize();
        }

        newAttrs[key] = val;
      }
    }
    return newAttrs;
  }
});