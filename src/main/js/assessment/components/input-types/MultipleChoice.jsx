import React from 'react';
import Mixin from './Mixin';

import {getEventTarget} from 'nti.lib.dom';

import toArray from 'nti.lib.interfaces/utils/toarray';
import isTruthy from 'nti.lib.interfaces/utils/identity';

const valueIfChecked = (i)=> i.checked && i.value;

/**
 * This input type represents Muliple Choice (with one answer--aka Radio Buttons)
 */
export default React.createClass({
	displayName: 'MultipleChoice',
	mixins: [Mixin],

	statics: {
		inputType: [
			'MultipleChoice',
			'RandomizedMultipleChoice'
		]
	},


	propTypes: {
		item: React.PropTypes.object
	},


	render () {
		let item = this.props.item;
		let choices = item.choices || [];
		let submitted = this.isSubmitted();
		let solution = submitted && this.getSolution();

		return (
			<form className="multiple-choice" ref="form">
				{choices.map((x, i) => {
					return this.renderChoice(x, i, solution);
				})}
			</form>
		);
	},


	onClick (e) {
		if (e) {
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


	renderChoice (choice, index, solution) {
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
			<label className={'choice ' + correct} key={`choice-${index}`} onClick={this.onClick}>
				<input type="radio" name={group} checked={checked} value={index} onChange={this.handleInteraction}/>
				<div>
					<span className="numeral">{numeral}.</span>
					<span className="choice-content" dangerouslySetInnerHTML={{__html: choice}}/>
				</div>
			</label>
		);
	},


	getValue () {
		let ref = this.refs.form;
		let form = ref && React.findDOMNode(ref);
		let inputs = form && toArray(form.elements);
		let values = form && inputs
							.map(valueIfChecked)
							.filter(isTruthy)
							.map(i => parseInt(i, 10));

		return !form ? undefined :
					values.length === 1 ?
						values[0] : null;
	}
});
