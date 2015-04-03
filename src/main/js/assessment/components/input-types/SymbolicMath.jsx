'use strict';

var React = require('react');
var Mixin = require('./Mixin');

var isEmpty = require('nti.lib.interfaces/utils/isempty');

/**
* This input type represents Symbolic Math
*/
module.exports = React.createClass({
	displayName: 'SymbolicMath',
	mixins: [Mixin],

	statics: {
		inputType: [
			'SymbolicMath'
		]
	},

	render: function() {

		var value = this.state.value;

		return (
			<form className="free-response">
				<input ref="input" value={value} onChange={this.handleInteraction}/>
			</form>
		);
	},


	getValue: function () {
		var ref = this.refs.input;
		var input = ref && ref.getDOMNode();
		var value = input && input.value;

		return isEmpty(value) ? null : value;
	}
});
