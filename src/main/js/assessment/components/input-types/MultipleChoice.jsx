import './MultipleChoice.scss';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { getEventTarget } from '@nti/lib-dom';
import { rawContent } from '@nti/lib-commons';

import Mixin, { stopEvent } from './Mixin';

const isTruthy = x => x;

const valueIfChecked = i => i.checked && i.value;

/**
 * This input type represents Muliple Choice (with one answer--aka Radio Buttons)
 */
export default createReactClass({
	displayName: 'MultipleChoice',
	mixins: [Mixin],

	statics: {
		inputType: ['MultipleChoice', 'RandomizedMultipleChoice'],
	},

	propTypes: {
		item: PropTypes.object,
	},

	attachRef(x) {
		this.form = x;
	},

	render() {
		let item = this.props.item;
		let choices = item.choices || [];
		let submitted = this.isSubmitted();
		let solution = submitted && this.getSolution();

		return (
			<form
				className="multiple-choice"
				ref={this.attachRef}
				onSubmit={stopEvent}
			>
				{choices.map((x, i) => {
					return this.renderChoice(x, i, solution);
				})}
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
		let group = this.props.item.getID();
		let checked = this.state.value === index;
		let correct = '';

		if (solution) {
			solution = solution.value === index;

			if (checked) {
				correct = solution ? 'correct' : 'incorrect';
			}
		}

		return (
			<label
				className={'choice ' + correct}
				key={`choice-${index}`}
				onClick={this.onClick}
			>
				<input
					type="radio"
					name={group}
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

		return !form ? undefined : values.length === 1 ? values[0] : null;
	},
});
