/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

/**
* This input type represents Muliple Choice (with multiple answers--aka Checkboxes)
*/
module.exports = React.createClass({
	displayName: 'MultipleChoiceMulipleAnswer',
	mixins: [Mixin],

	statics: {
		inputType: 'MultipleChoiceMultipleAnswer'
	},

	render: function() {
		var choices = this.props.item.choices || [];

		return (
			<form className="multiple-choice multiple-answer">
				{choices.map(this.renderChoice)}
			</form>
		);
	},


	renderChoice: function (choice, index) {
		var numeral = String.fromCharCode(65+index);

		return (
			<label className="choice" key={'choice-'+index}>
				<input type="checkbox" data-index={index} onChange={this.setPartInteracted}/>
				<div>
					<span className="numeral">{numeral}.</span>
					<span className="choice-content" dangerouslySetInnerHTML={{__html: choice}}/>
				</div>
			</label>
		);
	}
});
