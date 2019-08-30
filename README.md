# d2l-autocomplete
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/BrightspaceUI/autocomplete)
[![Bower version][bower-image]][bower-url]
[![Build status][ci-image]][ci-url]

Polymer-based web component for integrating autocomplete with text inputs

## Installation

`d2l-autocomplete` can be installed from [Bower][bower-url]:
```shell
bower install d2l-autocomplete
```

## Usage

Include the [webcomponents.js](http://webcomponents.org/polyfills/) polyfill loader (for browsers who don't natively support web components), then import the appropriate `d2l-autocomplete` components as needed:

```html
<head>
	<script src="bower_components/webcomponentsjs/webcomponents-loader.js"></script>
</head>
```

## Components

### Text Input
<!---
```
<custom-element-demo height="400"
  <template>
    <script src="../webcomponentsjs/webcomponents-loader.js"></script>
    <link rel="import" href="../d2l-typography/d2l-typography.html">
    <link rel="import" href="d2l-autocomplete-input-text.html">
    <custom-style include="d2l-typography">
      <style is="custom-style" include="d2l-typography"></style>
    </custom-style>
    <style>
      html {
        font-size: 20px;
        font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
      }
    </style>
    <next-code-block></next-code-block>
	<script>
		const autocomplete = document.getElementById('my-autocomplete')
		autocomplete.data = [
			{ value: 'Alabama' },
			{ value: 'Alaska' },
		]
	</script>
  </template>
</custom-element-demo>
```
-->
```html
<d2l-autocomplete-input-text id="my-autocomplete"></d2l-autocomplete-input-text>
```

```js
const autocomplete = document.getElementById('my-autocomplete')
autocomplete.data = [
	{ value: 'Option 1' },
	{ value: 'Option 2' }
]

/**
 * The filter function can be changed - it should accept two arguments (value, filter)
 * and return true if `value` should be in the filtered list.
 * E.g., Only return values that match the entered filter exactly
 */
autocomplete.filterFn = (value, filter) => value === filter;
```

### Custom Input

```html

<d2l-autocomplete id="my-autocomplete">
	<input id="my-input" slot="input">
</d2l-autocomplete>
<!-- Set data as above -->
```

### Remote Source
Set `remote-source` on the autocomplete.

Add an event listener for the `d2l-autocomplete-filter-change` event, and set the suggestions manually after fetching the filtered options.

E.g.,
```html
<d2l-autocomplete-input-text id="my-autocomplete" remote-source></d2l-autocomplete-input-text>
```

```js
autocomplete.addEventListener('d2l-autocomplete-filter-change', event => {
	fetchResultsFromRemoteSource(event.detail.value)
		.then(results => autocomplete.setSuggestions(results))
})
```

## Events

- `d2l-autocomplete-filter-change` (remote source only)
  - Emitted whenever the filter changes, provided the filter is at least `min-length` characters long (`default: 1`). Also fires when the input is cleared.
- `d2l-autocomplete-suggestion-selected`
  - Emitted when a suggestion from the dropdown is selected (keyboard or mouse).

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

If you don't have it already, install the [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) globally:

```shell
npm install -g polymer-cli
```

To start a [local web server](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

To lint ([eslint](http://eslint.org/) and [Polymer lint](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#lint)):

```shell
npm run lint
```

To run unit tests locally using [Polymer test](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#tests):

```shell
npm run test:polymer:local
```

To lint AND run local unit tests:

```shell
npm test
```

[bower-url]: http://bower.io/search/?q=d2l-autocomplete
[bower-image]: https://badge.fury.io/bo/d2l-autocomplete.svg
[ci-url]: https://travis-ci.org/BrightspaceUI/autocomplete
[ci-image]: https://travis-ci.org/BrightspaceUI/autocomplete.svg?branch=master

## Versioning & Releasing

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version and create a tag during the next build.
