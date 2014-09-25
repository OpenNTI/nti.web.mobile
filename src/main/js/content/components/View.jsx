/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('common/components/Loading');

// var Store = require('../Store');
// var Actions = require('../Actions');

module.exports = React.createClass({
	displayName: 'View',

	getInitialState: function() {
		return {};
	},


	componentDidMount: function() {
		//Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		this.getDataIfNeeded(nextProps);
	},


	getDataIfNeeded: function(props) {},


	_onChange: function() {},


	render: function() {
		return (<div/>);
	}
});
