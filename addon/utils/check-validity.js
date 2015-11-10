export default function checkValidity(property, object) {
  let { required, properties, validValues } = property;

  for (let i = 0, l = required.length; i < l; i++) {
    let requiredPropertyName = required[i];
    let value = object && object[requiredPropertyName];

    // handles nested properties
    if (properties[requiredPropertyName] && !properties[requiredPropertyName].isValid(value)) {
      return false;
    }

    // handles normal values
    if (!value) {
      return false;
    }
  }

  // handles validValues / enum
  if (validValues && validValues.indexOf(object) === -1) {
    return false;
  }

  return true;
}
