import React from 'react';
import Mixin from './Mixin';

import getEventTarget from 'nti.lib.dom/lib/geteventtarget';

import toArray from 'nti.lib.interfaces/utils/toarray';
import isTruthy from 'nti.lib.interfaces/utils/identity';

const valueIfChecked = i => i.checked && i.value;

/**
 * This input type represents Muliple Choice (with multiple answers--aka Checkboxes)
 */
export default React.createClass({
	displayName: 'MultipleChoiceMulipleAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'MultipleChoiceMultipleAnswer',
			'RandomizedMultipleChoiceMultipleAnswer'
		]
	},

	propTypes: {
		item: React.PropTypes.object
	},

	render () {
		let choices = this.props.item.choices || [];
		let submitted = this.isSubmitted();
		let solution = submitted && this.getSolution();

		return (
			<form className="multiple-choice multiple-answer" ref="form">
				{choices.map((x, i)=> this.renderChoice(x, i, solution))}
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

		console.log('Clicked');
		this.handleInteraction();
	},


	renderChoice (choice, index, solution) {
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
			<label className={'choice ' + correct} key={ref} onClick={this.onClick}>
				<input type="checkbox" ref={ref} checked={checked} value={index} onChange={this.handleInteraction}/>
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
					values.length ?
						values : null;
	}
});
