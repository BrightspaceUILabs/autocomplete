import '../autocomplete-input-text.js';
import { expect, fixture, html, oneEvent, sendKeys, waitUntil } from '@brightspace-ui/testing';

const basicFixture = html`
		<d2l-labs-autocomplete-input-text id="basic-test">
		</d2l-labs-autocomplete-input-text>
`;

const remoteFixture = html`
	<div>
		<d2l-labs-autocomplete-input-text remote-source id="remote-source-test">
		</d2l-labs-autocomplete-input-text>
	</div>
`;

const { UP, DOWN, ENTER, ESCAPE, HOME, END } = {
	UP: 'ArrowUp',
	DOWN: 'ArrowDown',
	ENTER: 'Enter',
	ESCAPE: 'Escape',
	HOME: 'Home',
	END: 'End',
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
			input = autocomplete._input;
			autocomplete.data = data;
		});

		it('should show the expected suggestions when a filter is entered', async() => {
			await setInputValue('a');
			const suggestions = getSuggestionElements();
			expect(suggestions.length).to.equal(2);

			const result = textFromSuggestions(suggestions);
			expect(result).to.deep.equal(['Alabama', 'Arizona']);
		});

		it('should fire an event when a suggestion is selected', async() => {

			await setInputValue('a');
			setTimeout(() => getSuggestionElements()[0].click());
			const event = await oneEvent(autocomplete, 'd2l-labs-autocomplete-suggestion-selected');
			expect(event.detail.value).to.equal('Alabama');
			expect(input.value).to.equal('Alabama');

		});

		describe('options', () => {

			it('should only render the suggestions if the input value meets the min-length', async() => {
				autocomplete.setAttribute('min-length', '3');
				await autocomplete.updateComplete;
				await setInputValue('al');

				expect(getSuggestionElements().length).to.equal(0);

				await setInputValue('ala');
				expect(getSuggestionElements().length).to.equal(1);
			});

		});

		describe('keyboard-behaviour', () => {

			let suggestions;

			beforeEach(async() => {
				await setInputValue('c');
				suggestions = getSuggestionElements();
			});

			it('should move the selected suggestion to the next element when the DOWN key is pressed', async() => {
				await sendKeys('press', DOWN);
				await sendKeys('press', DOWN);
				expect(suggestions[1]).to.equal(getSelectedElement());
			});

			it('should move the selected suggestion to the previous element when the DOWN key is pressed', async() => {
				await sendKeys('press', UP);
				await sendKeys('press', UP);
				expect(suggestions[suggestions.length - 2]).to.equal(getSelectedElement());
			});

			it('should select the first suggestion when the HOME key is pressed', async() => {
				await sendKeys('press', HOME);
				expect(suggestions[0]).to.equal(getSelectedElement());
			});

			it('should select the last suggestion when the END key is pressed', async() => {
				await sendKeys('press', END);
				expect(suggestions[suggestions.length - 1]).to.equal(getSelectedElement());
			});

			it('should fire an event when a suggestion is selected and ENTER is pressed', async() => {
				setTimeout(async() => {
					await sendKeys('press', DOWN);
					sendKeys('press', ENTER);
				});
				const event = await oneEvent(autocomplete, 'd2l-labs-autocomplete-suggestion-selected');
				expect(event.detail.value).to.equal('California');
				expect(input.value).to.equal('California');
			});

			it('should clear the input value when ESCAPE is pressed', async() => {
				expect(input.value).to.equal('c');
				await sendKeys('press', ESCAPE);
				expect(input.value).to.equal('');
			});
		});
	});

	describe('remote-source', () => {

		beforeEach(async() => {
			const elem = await fixture(remoteFixture);
			autocomplete = elem.querySelector('d2l-labs-autocomplete-input-text');
			input = autocomplete._input;
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

		it('should not fire an event when the filter is less than min length', async() => {
			autocomplete.setAttribute('min-length', 3);
			let eventCount = 0;
			autocomplete.addEventListener('d2l-labs-autocomplete-filter-change', () => eventCount++);
			await setInputValue('Al');
			expect(eventCount).to.equal(0);
		});

		it('should render the suggestions when calling setSuggestions', async() => {
			await setInputValue('a');
			const expectedSuggestions = ['Alaska', 'Argentina'];
			autocomplete.setSuggestions(expectedSuggestions.map((value) => {
				return { value };
			}));
			await autocomplete.updateComplete;

			const result = textFromSuggestions(getSuggestionElements());
			expect(result).to.deep.equal(expectedSuggestions);
		});
	});

	/* Helper functions */
	async function setInputValue(value) {
		input.focus();
		input.value = value;
		input.dispatchEvent(new Event('input', { detail: { value } }));
		await waitUntil(() => autocomplete._filter === value, '_filter property was never updated');
		await autocomplete.updateComplete;
	}

	function getSuggestionElements() {
		return autocomplete.shadowRoot.querySelectorAll('li');
	}

	function getSelectedElement() {
		return autocomplete.shadowRoot.activeElement;
	}

	function textFromSuggestions(suggestions) {
		return Array.prototype.slice.call(suggestions).map((element) => {
			// Trim for Edge
			return element.textContent.trim();
		});
	}

});
