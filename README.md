# ember-json-schema-document

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
}
```

## Loading a schema by URL

```js
var url = 'https://gridiron.aptible.com/schemas/workforce_locations/v0.0.3';

Schema.load(url).then((schema) => {
  var document = schema.buildDocument();
  var location = document.addItem();

  location.set('address', '155 Water St');
});
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
