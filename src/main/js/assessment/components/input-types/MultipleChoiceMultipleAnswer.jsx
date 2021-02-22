import './MultipleChoiceMultipleAnswer.scss';
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { getEventTarget } from '@nti/lib-dom';
import { rawContent } from '@nti/lib-commons';

import Mixin, { stopEvent } from './Mixin';

const isTruthy = x => x;

const valueIfChecked = i => i.checked && i.value;

/**
 * This input type represents Muliple Choice (with multiple answers--aka Checkboxes)
 */
export default createReactClass({
	displayName: 'MultipleChoiceMulipleAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'MultipleChoiceMultipleAnswer',
			'RandomizedMultipleChoiceMultipleAnswer',
		],
	},

	propTypes: {
		item: PropTypes.object,
	},

	attachRef(x) {
		this.form = x;
	},

	render() {
		let choices = this.props.item.choices || [];
		let submitted = this.isSubmitted();
		let solution = submitted && this.getSolution();

		return (
			<form
				className="multiple-choice multiple-answer"
				ref={this.attachRef}
				onSubmit={stopEvent}
			>
				{choices.map((x, i) => this.renderChoice(x, i, solution))}
			</form>
		);
	},

	onClick(e) {
		if (e) {
			const anchor = getEventTarget(e, 'a[href]');
			if (anchor) {
				anchor.setAttribute('target', '_blank');
				return;
			}
			e.preventDefault();
			e.stopPropagation();
		}
		let label = getEventTarget(e, 'label');
		let input = label && label.querySelector('input');
		if (input) {
			input.checked = !input.checked;
		}

		this.handleInteraction();
	},

	renderChoice(choice, index, solution) {
		let numeral = String.fromCharCode(65 + index);
		let ref = 'choice-' + index;
		let checked = (this.state.value || []).indexOf(index) !== -1;
		let correct = '';

		if (solution) {
			solution = (solution.value || []).indexOf(index) > -1;

			if (checked) {
				correct = solution ? 'correct' : 'incorrect';
			}
		}

		return (
			<label
				className={'choice ' + correct}
				key={ref}
				onClick={this.onClick}
			>
				<input
					type="checkbox"
					checked={checked}
					value={index}
					onChange={this.handleInteraction}
				/>
				<div>
					<span className="numeral">{numeral}.</span>
					<div className="choice-content" {...rawContent(choice)} />
				</div>
			</label>
		);
	},

	getValue() {
		const { form } = this;
		let inputs = form && Array.from(form.elements);
		let values =
			form &&
			inputs
				.map(valueIfChecked)
				.filter(isTruthy)
				.map(i => parseInt(i, 10));

		return !form ? undefined : values.length ? values : null;
	},
});
