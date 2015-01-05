'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

// var isEmpty = require('dataserverinterface/utils/isempty');

/**
* This input type represents Fill In The Blank - Short Answer
*/
module.exports = React.createClass({
	displayName: 'FillInTheBlankShortAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'FillInTheBlankShortAnswer'
		]
	},

	render: function() {

		// var value = this.state.value;

		return (
			<form className="fill-in-the-blank">
				<div dangerouslySetInnerHTML={{__html: this.props.item.input}}/>
			</form>
		);
	},


	getValue: function () {
		return null;
	}
});
