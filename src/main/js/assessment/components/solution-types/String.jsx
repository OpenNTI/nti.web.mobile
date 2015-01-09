'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

/**
 * This solution type represents Any solution who's value is just a string/html.
 */
module.exports = React.createClass({
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
		var ex = this.state.explanation || '';
		return (
			<div className="solutions">
				{this.renderSolution()}
				<div className="explanation" dangerouslySetInnerHTML={{__html: ex}}/>
			</div>
		);
	},


	renderSolution () {
		var solution = this.state.solution;

		if (!solution) {
			return null;
		}

		return (
			<div className="solution" dangerouslySetInnerHTML={{__html: solution.value || solution}}/>
		);
	}
});
