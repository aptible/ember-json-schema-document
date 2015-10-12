import Property from '../models/property';

export default function(object, rawProperties) {
  if (!object._properties) {
    let properties = object._properties = {};
    let keys = Object.keys(rawProperties);

    for (let i = 0, l = keys.length; i < l; i++) {
      let key = keys[i];
      let rawProperty = rawProperties[key];

      properties[key] = new Property(rawProperty);
    }
  }

  return object._properties;
}
