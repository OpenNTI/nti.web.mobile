/** @jsx React.DOM */

var React = require('react');
var NavRecord = require('../NavRecord');
var Button = require('../../common/components/forms/Button');
var Actions = require('../Actions');

function navigateAndClose() {
	if(this.props.record.disabled) {
		return;
	}
	$('.off-canvas-wrap').foundation('offcanvas', 'hide', 'move-right');
	Actions.navigate(this.props.record.href);
}

var NavDrawerItem = React.createClass({
	displayName: 'NavDrawerItem',

	propTypes: {
 		record: React.PropTypes.instanceOf(NavRecord).isRequired
	},

	render: function() {
		var record = this.props.record;
		return (
			<a onClick={navigateAndClose.bind(this)} className={record.disabled ? 'disabled' : ''}>{record.label}</a>
		);
	}

});

module.exports = NavDrawerItem;
