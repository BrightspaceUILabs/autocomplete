import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import 'd2l-inputs/d2l-input-text.js';
import 'd2l-polymer-behaviors/d2l-id.js';
import './d2l-autocomplete.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-autocomplete-input-text">
	<template strip-whitespace="">
		<style>
			:host {
				display: flex;
			}

		</style>

		<d2l-autocomplete
			data="[[data]]"
			id="[[_prefix('d2l-autocomplete')]]"
			min-length="[[minLength]]"
			remote-source="[[remoteSource]]"
			select-first="[[selectFirst]]"
			show-on-focus="[[showOnFocus]]"
		><d2l-input-text
			aria-label$="[[ariaLabel]]"
			id="[[_prefix('d2l-input-text')]]"
			maxlength="[[maxLength]]"
			placeholder$="[[placeholder]]"
			role="combobox"
			slot="input"
			type$="[[type]]"
			value="{{value}}">
		</d2l-input-text>
		</d2l-autocomplete>
	</template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * `<d2l-autocomplete-input-text>`
 * Polymer-based web component for integrating autocomplete with text inputs
 * @customElement
 * @polymer
 * @demo demo/index.hmtl
 */
class AutocompleteInputText extends PolymerElement {
	static get is() { return 'd2l-autocomplete-input-text'; }
	static get properties() {
		return {
			/**
			* Unique Id for prefixing the autocomplete and input-text
			*/
			_uniqueId: {
				type: String,
			},
			/**
			* These properties are used by d2l-autocomplete
			*/
			data: {
				type: Array,
			},
			minLength: {
				type: String,
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
		this._uniqueId = D2L.Id.getUniqueId();
	}

	_prefix(id) {
		return this._uniqueId + '-' + id;
	}

	setSuggestions(suggestions) {
		this.shadowRoot.querySelector('#' + this._prefix('d2l-autocomplete')).setSuggestions(suggestions);
	}

}
customElements.define(AutocompleteInputText.is, AutocompleteInputText);
