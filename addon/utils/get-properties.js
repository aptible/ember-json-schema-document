import Schema from '../models/schema';
import Property from '../models/property';

export default function(object, rawProperties) {
  if (!(object instanceof Schema) && !(object instanceof Property)) {
    throw new Error('You must provide a schema or a property object to get the properties for.');
  }

  if (!object._properties) {
    let properties = object._properties = {};
    let keys = Object.keys(rawProperties);

    for (let i = 0, l = keys.length; i < l; i++) {
      let key = keys[i];
      let rawProperty = rawProperties[key];

      while (rawProperty.$ref) {
        rawProperty = object.resolveURI(rawProperty.$ref);
      }

      properties[key] = new Property(rawProperty, object, key,
                                     object.schemaStack);
    }
  }

  return object._properties;
}
