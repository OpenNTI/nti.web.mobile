'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var Content = require('../Content');

var strategies = {
	'input[type=blankfield]': (x)=>({name: x.getAttribute('name')})
};


/**
 * This solution type represents Fill in the Blank - WordBank
 */
module.exports = React.createClass({
	displayName: 'FillInTheBlankShortAnswerAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'FillInTheBlankShortAnswer'
		]
	},

	render () {
		var ex = this.state.explanation || '';

		return (
			<div className="fill-in-the-blank solutions">
				<Content
					content={this.props.item.input}
					strategies={strategies}
					renderCustomWidget={this.renderInput}
					/>
				<div className="explanation" dangerouslySetInnerHTML={{__html: ex}}/>
			</div>
		);
	},


	renderInput(tag, props) {
		var {name, maxLength} = props;
		var solution = (this.state.solution || {}).value;
		var v = (solution || {})[name];

		return (
			<span className="target">
				<span className="blank">
					<input name={name} value={v} size={maxLength} readOnly/>
				</span>
			</span>
		);
	}
});
