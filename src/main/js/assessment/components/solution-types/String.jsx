import React from 'react';

import createReactClass from 'create-react-class';

import {rawContent} from 'nti-commons';

import Mixin from './Mixin';

/**
 * This solution type represents Any solution who's value is just a string/html.
 */
export default createReactClass({
	displayName: 'StringBasedAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'FreeResponse',
			'ModeledContent',
			'NumericMath',
			'SymbolicMath'//probably needs its own.
		]
	},

	render () {
		let ex = this.state.explanation || '';
		return (
			<div className="solutions">
				{this.renderSolution()}
				<div className="explanation" {...rawContent(ex)}/>
			</div>
		);
	},


	renderSolution () {
		let solution = this.state.solution;

		if (!solution) {
			return null;
		}

		return (
			<div className="solution" {...rawContent(solution.value || solution)}/>
		);
	}
});
