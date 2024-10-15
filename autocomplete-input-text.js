import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/dropdown/dropdown-content.js';
import '@brightspace-ui/core/components/dropdown/dropdown.js';
import './autocomplete.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import { LitElement, css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';


class AutocompleteInputText extends LitElement {
	static get is() { return 'd2l-labs-autocomplete-input-text'; }
	static get properties() {
		return {
			/**
			* Unique Id for prefixing the autocomplete and input-text
			*/
			_uniqueId: { type: String },
			/**
			* These properties are used by d2l-labs-autocomplete
			*/
			data: { type:Object },
			dropdownLabel: { type: String, attribute: 'dropdown-label' },
			maxLength: { type: String, attribute: 'max-length' },
			minLength: { type: String, attribute: 'min-length' },
			remoteSource: { type: Boolean, attribute: 'remote-resource' },
			showOnFocus: { type: Boolean, attribute: "show-on-focus" },
			_filter: { type: String },
			_dropdownIndex: { type: Number },
			/**
			* These properties are used by d2l-input-text
			*/
			ariaLabel: { type: String, attribute: 'aria-label' },
			placeholder: { type: String },
		};
	}
	static get styles() {
		return css`
			:host {
				display: flex;
			}
		`
	}

	get value() {
		this.shadowRoot.querySelector('d2l-labs-autocomplete').value
	}


	constructor() {
		super();
		this.dropdownLabel = null;
		this.data = []
		this._uniqueId = getUniqueId();
		this._filter = '';
		this._dropdownIndex = -1;
	}

	render() {
		return html`<d2l-labs-autocomplete
			dropdown-label="${this.dropdownLabel}"
			id="${this._prefix('d2l-labs-autocomplete')}"
			min-length="${this.minLength}"
			.data="${this.data}"
			@d2l-labs-autocomplete-suggestion-selected=${this._handleSuggestionSelected}
			?remote-source=${this.remoteSource}
			?show-on-focus=${this.showOnFocus}>
			<d2l-input-text
				aria-label="${this.ariaLabel}"
				id="${this._prefix('d2l-input-text')}"
				maxlength="${ifDefined(this.maxLength)}"
				novalidate
				autocomplete="list"
				placeholder="${ifDefined(this.placeholder)}"
				role="combobox"
				slot="input">
			</d2l-input-text>
		</d2l-labs-autocomplete>`
	}

	setSuggestions(suggestions) {
		this.shadowRoot.querySelector(`#${this._prefix('d2l-labs-autocomplete')}`).setSuggestions(suggestions);
	}

	_prefix(id) {
		return `${this._uniqueId}-${id}`;
	}

}
customElements.define(AutocompleteInputText.is, AutocompleteInputText);
