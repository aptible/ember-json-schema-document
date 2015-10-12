# Little-bobby

This README outlines the details of collaborating on this Ember addon.


```hbs
{{#schema-document currentSchema as |s|}}
  {{#each s.properties as |prop|}}
    <div>{{prop.display}}</div>

    {{component prop.componentName prop=prop}}
  {{/each}}
{{/schema-document}}
```

```js
schema = new Schema(jsonBlob);

var document = schema.buildDocument();

document.set('some.deep.thing', 'asdfasdf');

// style 1
item = document.addItem();
item.set('description', 'office thing');
item.set('streetAddress', '123 Whatevs Lane');

// style 2
document.addItem({
  description: 'office thing',
  streetAddress: '123 Whatevs Lane',
  city: 'Hope',
  state: 'RI',
  zip: '02831'
});

// ...snip...

document.toJSON();

[{
  "description": "office thing",
  "streetAddress": "123 Whatevs Lane",
  "city": "Hope",
  "state": "RI",
  "zip": "02831"
}]

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
