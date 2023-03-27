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

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Linting

```shell
npm run lint
```

### Testing

```shell
# lint & run headless unit tests
npm test

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
npm run test:headless:watch
```

### Running the demos

To start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo page and tests:

```shell
npm start
```

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`. Read on for more details...

The [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)
