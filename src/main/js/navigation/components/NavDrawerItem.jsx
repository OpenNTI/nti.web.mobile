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
		if(!this.props.record.clickable) {
			return;
		}
		Actions.navigate(this.props.record.href);
	},

	render: function() {
		var record = this.props.record;
		var depth = this.props.depth || 1;
		var sub = null;
		var ch = Array.isArray(record.children) ? record.children.map(function(v) {
			return <NavDrawerItem record={v} depth={depth} />
		}) : null;
		if(ch) {
			sub = <ul>{ch}</ul>
		}
		var label = record.label ? <a onClick={this._navigate} className={record.clickable ? '' : 'disabled'}>{record.label}</a> : null;
		return (
			<li>
				{label}
				{sub}
			</li>

		);
	}

});

module.exports = NavDrawerItem;
