import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import 'd2l-dropdown/d2l-dropdown-content.js';
import 'd2l-dropdown/d2l-dropdown.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-autocomplete">
	<template strip-whitespace="">
		<style>
			#d2l-autocomplete-list {
				margin: 0;
				max-height: 10rem;
				overflow-y: scroll;
				padding: 0;
			}

			.d2l-autocomplete-suggestion {
				@apply --d2l-body-compact-text;
				cursor: pointer;
				margin-right: 0.1rem;
				outline: none;
				overflow-x: hidden;
				padding: 0.4rem 0.7rem;
				text-align: left;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.d2l-autocomplete-suggestion-highlighted {
				font-weight: bold;
			}

			.d2l-autocomplete-suggestion[aria-selected="true"],
			.d2l-autocomplete-suggestion:hover  {
				  background-color: var(--d2l-color-celestine-plus-2);
			}
		</style>
		<d2l-dropdown class="d2l-autocomplete-dropdown-wrapper" no-auto-open="">
			<div class="d2l-dropdown-opener">
				<slot id="d2l-autocomplete-input" name="input"></slot>
			</div>
			<d2l-dropdown-content
				id="d2l-autocomplete-dropdown-content"
				max-width="[[_dropdownWidth]]"
				min-width="[[_dropdownWidth]]"
				no-auto-focus="[[selectFirst]]"
				no-padding=""
				no-pointer=""
				vertical-offset="5"
			><ul id="d2l-autocomplete-list" role="listbox">
				<template is="dom-repeat" items="{{_suggestions}}">
					<li
						aria-label$="[[item.value]]"
						aria-selected="false"
						id="d2l-autocomplete-list-item-[[index]]"
						class="d2l-autocomplete-suggestion"
						on-click="_onSuggestionSelected"
						role="option"
						tabindex="-1"
					>{{_computeText(item.value, _filter, 'prefix')}}<span class="d2l-autocomplete-suggestion-highlighted">{{_computeText(item.value, _filter, 'bolded')}}</span>{{_computeText(item.value, _filter, 'suffix')}}
					</li>
				</template>
			</ul>
			</d2l-dropdown-content>
		</d2l-dropdown>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * `<d2l-autocomplete>`
 * Polymer-based web component for integrating autocomplete with text inputs
 * @customElement
 * @polymer
 * @demo demo/index.hmtl
 */
class Autocomplete extends PolymerElement {
	static get is() { return 'd2l-autocomplete'; }
	static get properties() {
		return {
			/**
			* Reference to bound listener functions to be removed in disconnectedCallback
			*/
			_boundListeners: {
				type: Object,
				value: function() {
					return {
						_onBlur: null,
						_onFocus: null,
						_onInput: null,
						_onKeyDown: null,
					};
				}
			},
			/**
			* The current string query/filter being applied
			*/
			_filter: {
				type: String,
				value: '',
			},
			/**
			* Index of the currently 'selected' suggestion. This changes on up/down keypress
			*/
			_dropdownIndex: {
				type: Number,
				value: -1,
				observer: '_dropdownIndexChanged'
			},
			/**
			* Used to set the width of the dropdown
			*/
			_dropdownWidth: {
				type: Number,
			},
			/**
			* The input element associated with the autocomplete
			*/
			_input: {
				type: Node
			},
			/**
			* Whether the associated input has focus
			*/
			_inputHasFocus: {
				type: Boolean,
				value: false,
			},
			/**
			* The keycodes used for the autocomplete
			*/
			_keyCodes: {
				type: Object,
				value: { UP: 38, DOWN: 40, ENTER: 13, ESCAPE: 27, HOME: 36, END: 35 }
			},
			/**
			* List of autocomplete suggestions
			*/
			_suggestions: {
				type: Array,
				value: [],
				observer: '_suggestionsChanged'
			},
			/**
			* Array of all options. Not used when there is a remote source of data
			*/
			data: {
				type: Array,
				value: [],
			},
			/**
			* Function used to filter `data`
			*/
			filterFn: {
				type: Function,
			},
			/**
			* Minimum required length of query before searching
			*/
			minLength: {
				type: Number,
				value: 1,
			},
			/**
			* Indicates whether the data is from a remote source. Suggestions should be
			* handled by the user in this case
			*/
			remoteSource: {
				type: Boolean,
				value: false
			},
			/**
			* Automatically select the first suggestion
			*/
			selectFirst: {
				type: Boolean,
				value: false
			},
			/**
			* Show suggestions on input focus.
			*/
			showOnFocus: {
				type: Boolean,
				value: false
			},
			/**
			* Indicates whether the suggestions are visible
			*/
			suggestionsVisible: {
				type: Boolean,
				value: false,
				observer: '_suggestionsVisibleChanged',
				notify: true,
			},
		};
	}

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();

		// Query slot for the input element
		this._input = this.$['d2l-autocomplete-input'].assignedNodes() &&
			this.$['d2l-autocomplete-input'].assignedNodes()[0];

		if (!this._input) {
			throw new Error('Input not found');
		}
		this._input.setAttribute('aria-autocomplete', 'list');

		afterNextRender(this, function() {
			this._boundListeners = {
				_onBlur: this._onBlur.bind(this),
				_onFocus: this._onFocus.bind(this),
				_onInput: this._onInput.bind(this),
			};

			this._input.addEventListener('blur', this._boundListeners._onBlur);
			this._input.addEventListener('focus', this._boundListeners._onFocus);
			this._input.addEventListener('input', this._boundListeners._onInput);
			this.addEventListener('keydown', this._onKeyDown);
			this.addEventListener('d2l-dropdown-close', this._suggestionsVisibleChanged);
			this.addEventListener('d2l-dropdown-open', this._suggestionsVisibleChanged);
		}.bind(this));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._input.removeEventListener('blur', this._boundListeners._onBlur);
		this._input.removeEventListener('focus', this._boundListeners._onFocus);
		this._input.removeEventListener('input', this._boundListeners._onInput);
		this.removeEventListener('keydown', this._onKeyDown);
		this.removeEventListener('d2l-dropdown-close', this._suggestionsVisibleChanged);
		this.removeEventListener('d2l-dropdown-open', this._suggestionsVisibleChanged);
	}

	_onBlur(event) {
		if (event.relatedTarget !== this) {
			this._dropdownIndex = -1;
			this._inputHasFocus = false;
		}
	}

	_onFocus(event) {
		this._inputHasFocus = true;
		this._dropdownWidth = this._input.offsetWidth;
		if (this.showOnFocus && event.relatedTarget !== this) {
			this._updateSuggestionsVisible();
			this._selectDropdownIndex(this.selectFirst ? 0 : -1);
		}
	}

	_onInput(event) {
		const handler = function(filter) {
			return function() {
				this._filterChanged(filter);
			}.bind(this);
		}.bind(this);

		this._inputDebouncer = Debouncer.debounce(
			this._inputDebouncer,
			timeOut.after(250),
			handler(event.target.value));
	}

	_onKeyDown(event) {
		const { UP, DOWN, ENTER, ESCAPE, HOME, END} = this._keyCodes;
		const { keyCode } = event;

		if (keyCode === UP) {
			this._dropdownIndex - 1 >= 0
				? this._selectDropdownIndex(this._dropdownIndex - 1)
				: this._selectDropdownIndex(this._suggestions.length - 1);
		} else if (keyCode === DOWN) {
			this._dropdownIndex + 1 < this._suggestions.length
				? this._selectDropdownIndex(this._dropdownIndex + 1)
				: this._selectDropdownIndex(0);
		} else if (keyCode === HOME) {
			this._selectDropdownIndex(0);
		} else if (keyCode === END) {
			this._selectDropdownIndex(this._suggestions.length - 1);
		} else if (keyCode === ENTER && this._dropdownIndex >= 0) {
			this._onSuggestionSelected(this._dropdownIndex);
		} else if (keyCode === ESCAPE) {
			this._filter = '';
			this._input.value = '';
		} else {
			return;
		}
		event.preventDefault();
	}

	_onSuggestionSelected(event) {
		// For IE11
		Number.isInteger = Number.isInteger || function(value) {
			return typeof value === 'number' &&
				isFinite(value) &&
				Math.floor(value) === value;
		};
		const index = Number.isInteger(event)
			? event
			: event.model && event.model.index;
		const selection = this._suggestions[index].value;

		this._dropdownIndex = -1;
		this._input.value = selection;
		this._inputHasFocus = false;

		this._updateSuggestionsVisible();
		this.dispatchEvent(new CustomEvent(
			'd2l-autocomplete-suggestion-selected',
			{ bubbles: true, composed: true, detail: { value: selection } }
		));

		this._input.focus();
		this._inputHasFocus = true;
	}

	_computeText(text, filter, type) {
		const indexOfFilter = text.toLowerCase().indexOf(filter.toLowerCase());
		const filterInText = indexOfFilter !== -1;
		const indexOfFilterEnd = indexOfFilter + filter.length;

		switch (type) {
			case 'prefix':
				return filterInText
					? text.slice(0, indexOfFilter)
					: text;
			case 'bolded':
				return filterInText
					? text.slice(indexOfFilter, indexOfFilterEnd)
					: '';
			case 'suffix':
				return filterInText
					? text.slice(indexOfFilterEnd)
					: '';
		}
	}

	_dropdownIndexChanged(index, oldIndex) {
		afterNextRender(this, function() {
			const suggestionsListChildren = this.$['d2l-autocomplete-list'].children;
			if (oldIndex >= 0 && oldIndex < suggestionsListChildren.length) {
				suggestionsListChildren[oldIndex].setAttribute('aria-selected', false);
			}
			if (index >= 0 && index < suggestionsListChildren.length) {
				suggestionsListChildren[index].setAttribute('aria-selected', true);
				suggestionsListChildren[index].focus();
			}
		}.bind(this));
	}

	_filterChanged(filter) {
		if (this.remoteSource) {
			if (filter.length >= this.minLength) {
				// Fire event for parent component to handle suggestions
				this.dispatchEvent(new CustomEvent(
					'd2l-autocomplete-filter-change',
					{ bubbles: true, composed: true, detail: { value: filter } }
				));
			} else if (filter.length === 0) {
				this.dispatchEvent(new CustomEvent(
					'd2l-autocomplete-filter-change',
					{ bubbles: true, composed: true, detail: { value: '' } }
				));
			}
		} else {
			this._suggestions = filter.length === 0 || filter.length < this.minLength
				? []
				: this.data.filter(function(item) {
					return this.filterFn(item.value, filter);
				}.bind(this));
			this._filter = filter;
			this._updateSuggestionsVisible();
		}
	}

	_suggestionsVisibleChanged() {
		const suggestionsList = this.$['d2l-autocomplete-list'];
		this.$['d2l-autocomplete-dropdown-content'].opened
			? suggestionsList.setAttribute('role', 'listbox')
			: suggestionsList.removeAttribute('role');
	}

	_suggestionsChanged(updatedSuggestions) {
		this._selectDropdownIndex(this.selectFirst ? 0 : -1);
		return updatedSuggestions;
	}

	_selectDropdownIndex(index) {
		if (index >= 0 && this._suggestions.length && index < this._suggestions.length) {
			this._scrollList(index);
			this._dropdownIndex = index;
		} else {
			this._dropdownIndex = -1;
		}
	}

	_scrollList(index) {
		const suggestionsList = this.$['d2l-autocomplete-list'];
		const elem = suggestionsList.children[index];
		if (elem.offsetTop < suggestionsList.scrollTop) {
			suggestionsList.scrollTop = (elem.offsetTop);
		} else if (elem.offsetHeight + elem.offsetTop > suggestionsList.offsetHeight + suggestionsList.scrollTop) {
			suggestionsList.scrollTop = (elem.offsetTop + elem.offsetHeight - suggestionsList.offsetHeight);
		}
	}

	_updateSuggestionsVisible() {
		const meetsLength = this._filter.length >= this.minLength;
		const hasSuggestions = this._suggestions.length > 0;
		meetsLength && hasSuggestions && this._inputHasFocus
			? this.$['d2l-autocomplete-dropdown-content'].open(false)
			: this.$['d2l-autocomplete-dropdown-content'].close();
	}

	setSuggestions(suggestions) {
		this._suggestions = suggestions;
		this._filter = this._input.value;
		this._updateSuggestionsVisible();
	}

	filterFn(value, filter) {
		return value.toLowerCase().indexOf(filter.toLowerCase()) === 0;
	}

}
customElements.define(Autocomplete.is, Autocomplete);
