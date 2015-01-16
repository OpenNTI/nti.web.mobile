'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var ensureArray = require('dataserverinterface/utils/ensure-array');

/**
 * This solution type represents Muliple Choice (with multiple answers--aka Checkboxes)
 */
module.exports = React.createClass({
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

	render: function() {
		var ex = this.state.explanation || '';
		return (
			<div className="multiple-choice solutions">
				{this.renderSolution()}
				<div className="explanation" dangerouslySetInnerHTML={{__html: ex}}/>
			</div>
		);
	},


	renderSolution: function () {
		var item = this.props.item;
		var choices = (item || {}).choices || [];
		var solution = this.state.solution;

		if (!solution) {
			return null;
		}

		solution = ensureArray(solution.value);

		return solution.map(x=>{
					var numeral = String.fromCharCode(65+x);
					return (
						<div className="solution" key={x}>
							<span className="numeral">{numeral}</span>
							<span dangerouslySetInnerHTML={{__html: choices[x]}}/>
						</div>
					);
				});
	}
});
