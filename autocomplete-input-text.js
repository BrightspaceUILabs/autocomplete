import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import '@brightspace-ui/core/components/colors/colors.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
const KeyCodes = { UP: 38, DOWN: 40, ENTER: 13, ESCAPE: 27, HOME: 36, END: 35 };
class AutocompleteInputText extends LitElement {
	static get properties() {
		return {
			/**
			* These properties are used by d2l-labs-autocomplete
			*/
			data: { type:Object },
			dropdownLabel: { type: String, attribute: 'dropdown-label' },
			maxLength: { type: String, attribute: 'max-length' },
			minLength: { type: String, attribute: 'min-length' },
			remoteSource: { type: Boolean, attribute: 'remote-source' },
			showOnFocus: { type: Boolean, attribute: 'show-on-focus' },
			_showSuggestions: { state: true },
			_minWidth: { state: true },
			_filter: { state: true },
			_suggestions: { state: true }

		};
	}
	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				display: flex;
			}
			:host([hidden]) {
				display: none;
			}

			#d2l-labs-autocomplete-list {
				margin: 0;
				padding: 0;
			}

			#d2l-labs-autocomplete-dropdown-label {
				font-size: 0.7rem;
				padding: 0.4rem 0.7rem;
			}

			.d2l-labs-autocomplete-suggestion {
				cursor: pointer;
				margin-right: 0.1rem;
				outline: none;
				overflow-x: hidden;
				padding: 0.4rem 0.7rem;
				text-align: left;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.d2l-labs-autocomplete-suggestion-highlighted {
				font-weight: bold;
			}

			.d2l-labs-autocomplete-suggestion:focus,
			.d2l-labs-autocomplete-suggestion:hover {
				background-color: var(--d2l-color-celestine-plus-2);
			}
		`];
	}

	constructor() {
		super();
		this.data = [];
		this.dropdownLabel = null;
		this.minLength = 1;
		this.remoteSource = false;
		this.showOnFocus = false;
		this._filter = '';
		this._showSuggestions = false;
		this._suggestions = [];
		this._uniqueId = getUniqueId();

	}
	static get is() { return 'd2l-labs-autocomplete-input-text'; }

	render() {
		return html`<d2l-dropdown
			@d2l-dropdown-close=${this._onDropdownClose}
			class="d2l-labs-autocomplete-dropdown-wrapper"
			no-auto-open>
			<div class="d2l-dropdown-opener">
				<d2l-input-text
						aria-label="${this.getAttribute('aria-label')}"
						@input=${this._onInput}
						@keydown=${this._onKeyDown}
						@focus=${this._onFocus}
						maxlength="${ifDefined(this.maxLength)}"
						novalidate
						autocomplete="list"
						role="combobox">
				</d2l-input-text>
			</div>
			<d2l-dropdown-content
				id="d2l-labs-autocomplete-dropdown-content"
				no-auto-focus
				max-height="${this.maxHeight}"
				min-width="${this._minWidth}"
				no-padding=""
				no-pointer=""
				vertical-offset="5"
				align="start"
				?opened=${this._showSuggestions}
			>
				<div ?hidden="${!this.dropdownLabel}" id="d2l-labs-autocomplete-dropdown-label">${this.dropdownLabel}</div>
				<ul id="d2l-labs-autocomplete-list" role="listbox">
					${this._suggestions.map((item, index) => html`
						<li
								aria-label="${item.value}"
								data-index=${index}
								class="d2l-labs-autocomplete-suggestion d2l-body-compact"
								@click=${this._onSuggestionSelected}
								role="option"
								tabindex="0"
								@keydown=${this._onKeyDown}
							>
							${this._computeText(item.value)}
						</li>
					`)}
				</ul>
			</d2l-dropdown-content>
		</d2l-dropdown>`;
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('_filter')) this._filterChanged();
		if (changedProperties.has('_filter') || changedProperties.has('minLength') || changedProperties.has('_suggestions'))
			this._showSuggestions = this._suggestions.length > 0 && this._filter.length >= this.minLength;
	}

	setSuggestions(suggestions) {
		this._suggestions = suggestions;
	}

	get _input() {
		return this.shadowRoot.querySelector('d2l-input-text');
	}

	_computeText(text) {
		const filter = this._filter;
		const indexOfFilter = text.toLowerCase().indexOf(filter.toLowerCase());
		if (indexOfFilter === -1) return html`${text}`;
		const indexOfFilterEnd = indexOfFilter + filter.length;
		const prefix = text.slice(0, indexOfFilter);
		const bolded = text.slice(indexOfFilter, indexOfFilterEnd);
		const suffix = text.slice(indexOfFilterEnd);

		return html`${prefix}<span class="d2l-labs-autocomplete-suggestion-highlighted">${bolded}</span>${suffix}`;
	}

	_filterChanged() {
		const filter = this._filter;
		if (this.remoteSource) {
			if (filter.length >= this.minLength || filter.length === 0) {
				// Fire event for parent component to handle suggestions
				this.dispatchEvent(new CustomEvent(
					'd2l-labs-autocomplete-filter-change',
					{ bubbles: true, composed: true, detail: { value: filter } }
				));
			}
		} else {
			this.setSuggestions(
				filter.length < this.minLength ? [] : this.data.filter(({ value }) => {
					return value.toLowerCase().indexOf(filter.toLowerCase()) === 0;
				})
			);
		}
	}

	_focusDropdownIndex(index) {
		this.shadowRoot.querySelectorAll('.d2l-labs-autocomplete-suggestion')[index]?.focus();
	}

	_onDropdownClose() {
		this._showSuggestions = false;
	}

	_onFocus() {
		this._minWidth = this._input.offsetWidth;
		if (this.showOnFocus) this._showSuggestions = this._suggestions.length > 0;
	}

	_onInput() {
		clearTimeout(this._inputDebouncer);
		this._inputDebouncer = setTimeout(() => this._filter = this._input.value, 250);
	}

	_onKeyDown(event) {
		const { UP, DOWN, ENTER, ESCAPE, HOME, END } = KeyCodes;
		const { keyCode } = event;
		const currentIndex = Number(event.currentTarget.dataset.index ?? -1);
		if (keyCode === UP) {
			currentIndex - 1 >= 0
				? this._focusDropdownIndex(currentIndex - 1)
				: this._focusDropdownIndex(this._suggestions.length - 1);
		} else if (keyCode === DOWN) {
			currentIndex + 1 < this._suggestions.length
				? this._focusDropdownIndex(currentIndex + 1)
				: this._focusDropdownIndex(0);
		} else if (keyCode === HOME) {
			this._focusDropdownIndex(0);
		} else if (keyCode === END) {
			this._focusDropdownIndex(this._suggestions.length - 1);
		} else if (keyCode === ENTER && currentIndex >= 0) {
			this._selectDropdownIndex(currentIndex);
		} else if (keyCode === ESCAPE) {
			this._input.value = '';
		} else {
			return;
		}
		event.preventDefault();
	}

	_onSuggestionSelected(event) {
		this._selectDropdownIndex(Number(event.currentTarget.dataset.index));
	}

	_prefix(id) {
		return `${this._uniqueId}-${id}`;
	}

	_selectDropdownIndex(index) {
		const selection = this._suggestions[index].value;
		this._input.value = selection;
		this._showSuggestions = false;
		this.dispatchEvent(new CustomEvent(
			'd2l-labs-autocomplete-suggestion-selected',
			{ bubbles: true, composed: true, detail: { value: selection } }
		));

		this._input.focus();
	}

}
customElements.define(AutocompleteInputText.is, AutocompleteInputText);
