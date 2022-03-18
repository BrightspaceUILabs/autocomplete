import '../autocomplete.js';
import '../autocomplete-input-text.js';
import '@polymer/iron-test-helpers/mock-interactions.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { flush as flush$0 } from '@polymer/polymer/lib/utils/flush.js';

const basicFixture = html`
		<d2l-labs-autocomplete id="basic-test">
			<input slot="input">
		</d2l-labs-autocomplete>
`;

const remoteFixture = html`
	<div>
		<d2l-labs-autocomplete remote-source id="remote-source-test">
			<input slot="input">
		</d2l-labs-autocomplete>
	</div>
`;

const { UP, DOWN, ENTER, ESCAPE, HOME, END } = {
	UP: 38,
	DOWN: 40,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	END: 35,
};

describe('d2l-labs-autocomplete-input-text', () => {

	let autocomplete;
	let input;

	const data = [
		{ value: 'Alabama' },
		{ value: 'Arizona' },
		{ value: 'California' },
		{ value: 'Colorado' },
		{ value: 'Connecticut' },
	];

	describe('basic', () => {

		beforeEach(async() => {
			autocomplete = await fixture(basicFixture);
			input = autocomplete.querySelector('input');
			autocomplete.data = data;
		});

		it('should show the expected suggestions when a filter is entered', async() => {
			setInputValue('a');
			const suggestions = getSuggestionElements();
			expect(suggestions.length).to.equal(2);

			const result = textFromSuggestions(suggestions);
			expect(result).to.deep.equal(['Alabama', 'Arizona']);
		});

		it('should fire an event when a suggestion is selected', async() => {

			setInputValue('a');
			setTimeout(() => getSuggestionElements()[0].click());

			const event = await oneEvent(autocomplete, 'd2l-labs-autocomplete-suggestion-selected');
			expect(event.detail.value).to.equal('Alabama');
			expect(input.value).to.equal('Alabama');

		});

		describe('options', () => {

			it('should select the first suggestion when select-first is true', (done) => {

				autocomplete.setAttribute('select-first', 'select-first');
				setInputValue('a');

				afterNextRender(autocomplete, () => {
					expect(getSuggestionElements()[0]).to.equal(getSelectedElement());
					done();
				});

			});

			it('should only render the suggestions if the input value meets the min-length', async() => {
				autocomplete.setAttribute('min-length', '3');
				setInputValue('al');
				await flush$0();

				expect(getSuggestionElements().length).to.equal(0);

				setInputValue('ala');
				await flush$0();
				expect(getSuggestionElements().length).to.equal(1);
			});

		});

		describe('keyboard-behaviour', () => {

			let suggestions;

			beforeEach(() => {
				setInputValue('c');
				suggestions = getSuggestionElements();
			});

			it('should move the selected suggestion to the next element when the DOWN key is pressed', (done) => {
				MockInteractions.keyDownOn(input, DOWN);
				MockInteractions.keyDownOn(input, DOWN);
				afterNextRender(basicFixture, () => {
					expect(suggestions[1]).to.equal(getSelectedElement());
					done();
				});
			});

			it('should move the selected suggestion to the previous element when the DOWN key is pressed', (done) => {
				MockInteractions.keyDownOn(input, UP);
				MockInteractions.keyDownOn(input, UP);
				afterNextRender(basicFixture, () => {
					expect(suggestions[suggestions.length - 2]).to.equal(getSelectedElement());
					done();
				});
			});

			it('should select the first suggestion when the HOME key is pressed', (done) => {
				MockInteractions.keyDownOn(input, HOME);
				afterNextRender(basicFixture, () => {
					expect(suggestions[0]).to.equal(getSelectedElement());
					done();
				});
			});

			it('should select the last suggestion when the END key is pressed', (done) => {
				MockInteractions.keyDownOn(input, END);
				afterNextRender(basicFixture, () => {
					expect(suggestions[suggestions.length - 1]).to.equal(getSelectedElement());
					done();
				});
			});

			it('should fire an event when a suggestion is selected and ENTER is pressed', async() => {
				setTimeout(() => {
					MockInteractions.keyDownOn(input, DOWN);
					MockInteractions.keyDownOn(input, ENTER);
				});
				const event = await oneEvent(autocomplete, 'd2l-labs-autocomplete-suggestion-selected');
				expect(event.detail.value).to.equal('California');
				expect(input.value).to.equal('California');
			});

			it('should clear the input value when ESCAPE is pressed', () => {
				expect(input.value).to.equal('c');
				MockInteractions.keyDownOn(input, ESCAPE);
				flush$0();
				expect(input.value).to.equal('');
			});
		});
	});

	describe('remote-source', () => {

		beforeEach(async() => {
			const elem = await fixture(remoteFixture);
			input = elem.querySelector('input');
			autocomplete = elem.querySelector('d2l-labs-autocomplete');
		});

		it('should fire an event when the input changes', async() => {
			setTimeout(() => setInputValue('a'));
			const event = await oneEvent(autocomplete, 'd2l-labs-autocomplete-filter-change');
			expect(event.detail.value).to.equal('a');
		});

		it('should fire an event when the input is empty', async() => {
			setTimeout(() => setInputValue('Alaba'));
			await oneEvent(autocomplete, 'd2l-labs-autocomplete-filter-change');
			setTimeout(() => setInputValue(''));
			const event = await oneEvent(autocomplete, 'd2l-labs-autocomplete-filter-change');
			expect(event.detail.value).to.equal('');
		});

		it('should not fire an event when the filter is less than min length', () => {
			autocomplete.setAttribute('min-length', 3);
			let eventCount = 0;
			autocomplete.addEventListener('d2l-labs-autocomplete-filter-change', () => eventCount++);
			setInputValue('Al');
			expect(eventCount).to.equal(0);
		});

		it('should render the suggestions when calling setSuggestions', () => {
			setInputValue('a');
			const expectedSuggestions = ['Alaska', 'Argentina'];
			autocomplete.setSuggestions(expectedSuggestions.map((value) => {
				return { value };
			}));
			flush$0();

			const result = textFromSuggestions(getSuggestionElements());
			expect(result).to.deep.equal(expectedSuggestions);
		});
	});

	/* Helper functions */
	function setInputValue(value) {
		input.focus();
		input.value = value;
		input.dispatchEvent(new Event('input', { detail: { value } }));
		// Flush the debouncer to ensure that the input value has been set
		autocomplete._inputDebouncer.flush();
		autocomplete.shadowRoot.querySelector('dom-repeat').render();
	}

	function getSuggestionElements() {
		return autocomplete.shadowRoot.querySelectorAll('li');
	}

	function getSelectedElement() {
		return autocomplete.shadowRoot.querySelector('li[aria-selected=true]');
	}

	function textFromSuggestions(suggestions) {
		return Array.prototype.slice.call(suggestions).map((element) => {
			// Trim for Edge
			return element.textContent.trim();
		});
	}

});
