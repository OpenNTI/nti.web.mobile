/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('common/components/Loading');

var Store = require('../Store');
var Actions = require('../Actions');

module.exports = React.createClass({
	displayName: 'View',

	getInitialState: function() {
		return {
			loading: true
		};
	},


	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(props) {
		if (this.props.pageId !== props.pageId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded: function(props) {
		this.setState(this.getInitialState());
		Actions.loadPage(decodeURIComponent(props.pageId));
	},


	_onChange: function(change) {

	},


	render: function() {
		return (<div>{this.props.pageId}</div>);
	}
});
