/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

/**
 * This input type represents Muliple Choice (with one answer--aka Radio Buttons)
 */
module.exports = React.createClass({
	displayName: 'MultipleChoice',
	mixins: [Mixin],

	statics: {
		inputType: [
			'MultipleChoice',
			'RandomizedMultipleChoice'
		]
	},

	render: function() {
		var choices = this.props.item.choices || [];

		return (
			<form className="multiple-choice">
				{choices.map(this.renderChoice)}
			</form>
		);
	},


	renderChoice: function (choice, index) {
		var numeral = String.fromCharCode(65+index);
		var group = this.props.item.getID();

		return (
			<label className="choice" key={'choice-'+index}>
				<input type="radio" name={group} data-index={index} onChange={this.setPartInteracted}/>
				<div>
					<span className="numeral">{numeral}.</span>
					<span className="choice-content" dangerouslySetInnerHTML={{__html: choice}}/>
				</div>
			</label>
		);
	}
});
