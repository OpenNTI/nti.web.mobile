/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'ContentWidgetUnknown',

	componentDidMount: function() {
		console.log('Component Mounted');
	},

	componentWillUnmount: function() {
		console.log('Component Unmounting...');
	},


	render: function() {
		var type = this.props.item.type;
		return (
			<div onClick={this._onClick}>Unknown Type: {type}</div>
		);
	},

	_onClick: function () {
		this._owner.setState({foobar: true})
	}
});
