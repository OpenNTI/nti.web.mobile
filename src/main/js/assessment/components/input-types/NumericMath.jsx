'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var isEmpty = require('dataserverinterface/utils/isempty');
var isValid = /^[0-9\-\/\\,\.\*¼-¾]*$/;

/**
* This input type represents Numeric Math
*/
module.exports = React.createClass({
	displayName: 'NumericMath',
	mixins: [Mixin],

	statics: {
		inputType: [
			'NumericMath'
		]
	},

	render: function() {

		var value = this.state.value || '';

		return (
			<form className="free-response">
				<input ref="input" value={value} onChange={this.handleInteraction}/>
			</form>
		);
	},


	getValue: function () {
		var ref = this.refs.input;
		var input = ref && ref.getDOMNode();
		var value = (input && input.value) || '';

		return isEmpty(value) ? null :
				!isValid.test(value) ?
					(this.state.value || null) : value;
	}
});
