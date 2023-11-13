# @brightspace-ui-labs/autocomplete

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui-labs/autocomplete.svg)](https://www.npmjs.org/package/@brightspace-ui-labs/autocomplete)

> Note: this is a ["labs" component](https://github.com/BrightspaceUI/guide/wiki/Component-Tiers). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [ ] [Design organization buy-in](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#working-with-design)
> - [ ] [design.d2l entry](http://design.d2l/)
> - [ ] [Architectural sign-off](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#web-component-architecture)
> - [x] [Continuous integration](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-continuously-with-travis-ci)
> - [x] [Cross-browser testing](https://github.com/BrightspaceUI/guide/wiki/Testing#cross-browser-testing-with-sauce-labs)
> - [ ] [Unit tests](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-with-polymer-test) (if applicable)
> - [ ] [Accessibility tests](https://github.com/BrightspaceUI/guide/wiki/Testing#automated-accessibility-testing-with-axe)
> - [ ] [Visual diff tests](https://github.com/BrightspaceUI/visual-diff)
> - [x] [Localization](https://github.com/BrightspaceUI/guide/wiki/Localization) with Serge (if applicable)
> - [x] Demo page
> - [ ] README documentation

Polymer-based web component for integrating autocomplete with text inputs

## Installation

```shell
npm install @brightspace-ui-labs/autocomplete
```

## Components

### Text Input

```html
<d2l-labs-autocomplete-input-text id="my-autocomplete"></d2l-labs-autocomplete-input-text>
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

<d2l-labs-autocomplete id="my-autocomplete">
	<input id="my-input" slot="input">
</d2l-labs-autocomplete>
<!-- Set data as above -->
```

### Remote Source
Set `remote-source` on the autocomplete.

Add an event listener for the `d2l-labs-autocomplete-filter-change` event, and set the suggestions manually after fetching the filtered options.

E.g.,
```html
<d2l-labs-autocomplete-input-text id="my-autocomplete" remote-source></d2l-labs-autocomplete-input-text>
```

```js
autocomplete.addEventListener('d2l-labs-autocomplete-filter-change', event => {
	fetchResultsFromRemoteSource(event.detail.value)
		.then(results => autocomplete.setSuggestions(results))
})
```

## Events

- `d2l-labs-autocomplete-filter-change` (remote source only)
  - Emitted whenever the filter changes, provided the filter is at least `min-length` characters long (`default: 1`). Also fires when the input is cleared.
- `d2l-labs-autocomplete-suggestion-selected`
  - Emitted when a suggestion from the dropdown is selected (keyboard or mouse).

## Developing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Testing

To run the full suite of tests:

```shell
npm test
```

Alternatively, tests can be selectively run:

```shell
# eslint
npm run lint:eslint

# stylelint
npm run lint:style

# unit tests
npm run test:unit
```

### Running the demos

To start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo page and tests:

```shell
npm start
```

### Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.
