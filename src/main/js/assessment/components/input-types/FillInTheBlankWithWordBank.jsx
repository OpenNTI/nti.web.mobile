'use strict';

var React = require('react/addons');
var InputType = require('./Mixin');

var Content = require('../Content');

var {Mixin, DropTarget} = require('common/dnd');

/**
 * This input type represents Fill In The Blank: With Word Bank
 */
module.exports = React.createClass({
	displayName: 'FillInTheBlankWithWordBank',
	mixins: [InputType],

	statics: {
		inputType: [
			'FillInTheBlankWithWordBank'
		]
	},

	render: function() {

		return (
			<form className="fill-in-the-blank">
				<Content
					content={this.props.item.input}
					strategies={this.state.strategies}
				/>
			</form>
		);
	},


	getValue: function () {
		return null;
	}
});
