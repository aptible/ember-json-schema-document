# ember-json-schema

The purpose of this addon is to simplify the process of creating and validating schema-based JSON documents.

### Building an array-based Document

```js
var schema = new Schema(jsonBlob);
var document = schema.buildDocument();

item = document.addItem();
item.set('description', 'Headquarters');
item.set('streetAddress', '155 Water St');

document.dump();

[{
  "description": "Headquarters",
  "streetAddress": "155 Water St"
}]

```

### Building an object-based Document


```js
var schema = new Schema(jsonBlob);
var document = schema.buildDocument();

document.set('description', 'Headquarters');
document.set('streetAddress', '155 Water St');

document.dump();

{
  "description": "Headquarters",
  "streetAddress": "155 Water St"
]
```

### Generating form controls

The following template will iterate a schema's properties and build UI components
that are bound to corresponding document values;

```js
var schema = new Schema(jsonBlob);
var document = schema.buildDocument();
var properties = schema.properties();
```

```hbs
{{#each-property properties=properties as |key property type|}}
  <label>{{property.displayProperties.title}}</label>
  {{component (concat 'schema-field-' type) key=key property=property document=location}}
{{/each-property}}
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
