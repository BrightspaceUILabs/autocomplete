# d2l-labs-autocomplete

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui-labs/autocomplete.svg)](https://www.npmjs.org/package/@brightspace-ui-labs/autocomplete)
[![Dependabot badge](https://flat.badgen.net/dependabot/BrightspaceUILabs/autocomplete?icon=dependabot)](https://app.dependabot.com/)
[![Build status](https://travis-ci.com/brightspaceUILabs/autocomplete.svg?branch=master)](https://travis-ci.com/brightspaceUILabs/autocomplete)

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

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version, create a tag, and trigger a deployment to NPM.
