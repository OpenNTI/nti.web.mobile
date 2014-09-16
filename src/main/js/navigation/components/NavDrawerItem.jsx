/** @jsx React.DOM */

var React = require('react');
var NavRecord = require('../NavRecord');
var Button = require('../../common/components/forms/Button');
var Actions = require('../Actions');


var NavDrawerItem = React.createClass({
	displayName: 'NavDrawerItem',

	propTypes: {
 		record: React.PropTypes.instanceOf(NavRecord).isRequired
	},

	_navigate: function() {
		if(this.props.record.disabled) {
			return;
		}
		Actions.navigate(this.props.record.href);
	},

	render: function() {
		var record = this.props.record;
		return (
			<a onClick={this._navigate} className={record.disabled ? 'disabled' : ''}>{record.label}</a>
		);
	}

});

module.exports = NavDrawerItem;
