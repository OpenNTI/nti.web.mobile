'use strict';

var React = require('react');
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
		var {name} = props;
		var solution = (this.state.solution || {}).value;
		var v = (solution || {})[name];

		if (typeof v === 'object') {
			v = v.solution;
		}

		return (
			<span className="target">
				<span className="blank">{v}</span>
			</span>
		);
	}
});
