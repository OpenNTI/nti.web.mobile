import React from 'react';
import Mixin from './Mixin';

import ensureArray from 'nti.lib.interfaces/utils/ensure-array';

/**
 * This solution type represents Muliple Choice (with multiple answers--aka Checkboxes)
 */
export default React.createClass({
	displayName: 'MultipleChoiceMulipleAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'MultipleChoice',
			'MultipleChoiceMultipleAnswer',
			'RandomizedMultipleChoice',
			'RandomizedMultipleChoiceMultipleAnswer'
		]
	},


	propTypes: {
		item: React.PropTypes.object
	},

	render () {
		let ex = this.state.explanation || '';
		return (
			<div className="multiple-choice solutions">
				{this.renderSolution()}
				<div className="explanation" dangerouslySetInnerHTML={{__html: ex}}/>
			</div>
		);
	},


	renderSolution () {
		let item = this.props.item;
		let choices = (item || {}).choices || [];
		let solution = this.state.solution;

		if (!solution) {
			return null;
		}

		solution = ensureArray(solution.value);

		return solution.map(x=> {
			let numeral = String.fromCharCode(65 + x);
			return (
				<div className="solution" key={x}>
					<span className="numeral">{numeral}</span>
					<span dangerouslySetInnerHTML={{__html: choices[x]}}/>
				</div>
			);
		});
	}
});
