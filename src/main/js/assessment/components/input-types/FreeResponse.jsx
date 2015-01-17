'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var isEmpty = require('dataserverinterface/utils/isempty');

/**
 * This input type represents Free Response
 */
module.exports = React.createClass({
	displayName: 'FreeResponse',
	mixins: [Mixin],
	saveBuffer: 10000,//10seconds

	statics: {
		inputType: [
			'FreeResponse'
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
