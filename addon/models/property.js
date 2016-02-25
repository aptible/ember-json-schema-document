import getProperties from '../utils/get-properties';
import buildDefaultValueForType from '../utils/build-default-value-for-type';
import checkValidity from '../utils/check-validity';

export default class Property {
  constructor(property, _parentProperty, _key, _schemaStack) {
    if (!property) {
      throw new Error('You must provide a property definition to the `Property` constructor.');
    }

    if (_parentProperty && !_key) {
      throw new Error('You must provide a property `key` to the `Property` constructor when a `parentProperty` exists.');
    }

    this._key = _key;
    this._property = property;
    this._parentProperty = _parentProperty;
    this._schemaStack = _schemaStack;
  }

  get type() {
    return this._property.type;
  }

  get displayProperties() {
    return this._property.displayProperties;
  }

  get default() {
    return this._property.default;
  }

  get readonly() {
    return this._property.readonly || false;
  }

  get title() {
    return this._property.title;
  }

  get description() {
    return this._property.description;
  }

  get properties() {
    if (this._property.properties) {
      return getProperties(this, this._property.properties);
    }

    return null;
  }

  getChildProperty(key) {
    return this.properties[key];
  }

  resolveURI(uri) {
    let hashIdx = uri.indexOf('#');

    if (hashIdx === -1) {
      return this._property.properties[uri];
    }

    if (hashIdx === 0) {
      return this._schemaStack[0].resolveURI(uri.substr(1));
    }

    throw new Error('Only relative root references are implemented');
  }

  get validValues() {
    return this._property.enum;
  }

  buildDefaultValue() {
    return buildDefaultValueForType(this._property.type);
  }

  isValid(object) {
    return checkValidity(this, object);
  }

  get required() {
    return this._property.required || [];
  }

  get dependencies() {
    return this._property.dependencies || {};
  }

  get parentProperty() {
    return this._parentProperty;
  }

  get hasParentProperty() {
    return !!this._parentProperty;
  }

  get key() {
    return this._key;
  }

  get isDependentProperty() {
    return this.dependsOnProperties.length > 0;
  }

  get hasDependentProperties() {
    return this.dependentProperties.length > 0;
  }

  get dependsOnProperties() {
    let myKey = this.key;
    let dependsOn = [];

    if (this.hasParentProperty) {
      let siblingDependencies = this.parentProperty.dependencies;

      for (let key in siblingDependencies) {
        if (siblingDependencies[key].indexOf(myKey) > -1) {
          dependsOn.push(this.parentProperty.getChildProperty(key));
        }
      }
    }

    return dependsOn;
  }

  get dependentProperties() {
    let myKey = this.key;
    let dependents = [];

    if (this.hasParentProperty) {
      let siblingDependencies = this.parentProperty.dependencies;

      Object.keys(siblingDependencies).forEach((key) => {
        if (key === myKey) {
          siblingDependencies[key].forEach((key) => {
            dependents.push(this.parentProperty.getChildProperty(key));
          });
        }
      });
    }

    return dependents;
  }

  get documentPath() {
    if (this.hasParentProperty) {
      if (this.parentProperty.documentPath) {
        return [this.parentProperty.documentPath, this.key].join('.');
      } else {
        return this.key;
      }
    }

    return '';
  }

  get schemaStack() {
    return this._schemaStack;
  }
}
