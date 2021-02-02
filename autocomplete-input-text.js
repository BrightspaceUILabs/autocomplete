import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import { getUniqueId } from '@brightspace-ui/core/helpers/uniqueId.js';
import './autocomplete.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-labs-autocomplete-input-text">
	<template strip-whitespace="">
		<style>
			:host {
				display: flex;
			}

		</style>

		<d2l-labs-autocomplete
			data="[[data]]"
			dropdown-label="[[dropdownLabel]]"
			id="[[_prefix('d2l-labs-autocomplete')]]"
			min-length="[[minLength]]"
			max-width="[[maxWidth]]"
			min-width="[[minWidth]]"
			on-d2l-labs-autocomplete-suggestion-selected="_handleSuggestionSelected"
			remote-source="[[remoteSource]]"
			select-first="[[selectFirst]]"
			show-on-focus="[[showOnFocus]]"
		><d2l-input-text
			aria-label$="[[ariaLabel]]"
			id="[[_prefix('d2l-input-text')]]"
			maxlength="[[maxLength]]"
			novalidate
			on-input="_handleInput"
			placeholder$="[[placeholder]]"
			role="combobox"
			slot="input"
			type$="[[type]]"
			value="[[value]]">
		</d2l-input-text>
		</d2l-labs-autocomplete>
	</template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * `<d2l-labs-autocomplete-input-text>`
 * Polymer-based web component for integrating autocomplete with text inputs
 * @customElement
 * @polymer
 * @demo demo/index.hmtl
 */
class AutocompleteInputText extends PolymerElement {
	static get is() { return 'd2l-labs-autocomplete-input-text'; }
	static get properties() {
		return {
			/**
			* Unique Id for prefixing the autocomplete and input-text
			*/
			_uniqueId: {
				type: String,
			},
			/**
			* These properties are used by d2l-labs-autocomplete
			*/
			data: {
				type: Array,
			},
			dropdownLabel: {
				type: String,
				value: null,
			},
			minLength: {
				type: String,
			},
			maxWidth: {
				type: Number,
			},
			minWidth: {
				type: Number,
			},
			remoteSource: {
				type: Boolean
			},
			selectFirst: {
				type: Boolean,
			},
			showOnFocus: {
				type: Boolean,
			},
			/**
			* These properties are used by d2l-input-text
			*/
			ariaLabel: {
				type: String
			},
			maxLength: {
				type: String,
			},
			placeholder: {
				type: String,
			},
			type: {
				type: String,
				value: 'text'
			},
			value: {
				type: String,
			}
		};
	}
	constructor() {
		super();
		this._uniqueId = getUniqueId();
	}

	setSuggestions(suggestions) {
		this.shadowRoot.querySelector('#' + this._prefix('d2l-labs-autocomplete')).setSuggestions(suggestions);
	}

	_handleInput(e) {
		this.value = e.target.value;
	}

	_handleSuggestionSelected(e) {
		this.value = e.detail.value;
	}

	_prefix(id) {
		return this._uniqueId + '-' + id;
	}

}
customElements.define(AutocompleteInputText.is, AutocompleteInputText);
