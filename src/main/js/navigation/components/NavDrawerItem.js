/**
 * @jsx React.DOM
 */

var React = require('react');
var NavRecord = require('../NavRecord');
var Button = require('../../common/components/forms/Button');
var Actions = require('../Actions');

function navigateAndClose() {
	if(this.props.record.disabled) {
		return;
	}
	Actions.navigate(this.props.record.href);
}

var NavDrawerItem = React.createClass({

	propTypes: {
 		record: React.PropTypes.instanceOf(NavRecord).isRequired
	},

	render: function() {
		var record = this.props.record;
		return (
			<Button onClick={navigateAndClose.bind(this)}>{record.label}</Button>
		);
	}

});

module.exports = NavDrawerItem;