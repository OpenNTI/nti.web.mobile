/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var isTruthy = require('dataserverinterface/utils/identity');
var valueIfChecked = function(i){return i.checked && i.value; };

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
			<form className="multiple-choice" ref="form">
				{choices.map(this.renderChoice)}
			</form>
		);
	},


	renderChoice: function (choice, index) {
		var numeral = String.fromCharCode(65+index);
		var group = this.props.item.getID();
		var checked = this.state.value === index;

		return (
			<label className="choice" key={'choice-'+index}>
				<input type="radio" name={group} checked={checked} value={index} onChange={this.handleInteraction}/>
				<div>
					<span className="numeral">{numeral}.</span>
					<span className="choice-content" dangerouslySetInnerHTML={{__html: choice}}/>
				</div>
			</label>
		);
	},


	getValue: function () {
		var ref = this.refs.form;
		var form = ref && ref.getDOMNode();
		var inputs = form && Array.prototype.slice.call(form.elements);
		var values = form && inputs
							.map(valueIfChecked)
							.filter(isTruthy)
							.map(function(i){return parseInt(i,10);});

		return !form ? undefined :
					values.length===1 ?
						values[0] : null;
	}
});
