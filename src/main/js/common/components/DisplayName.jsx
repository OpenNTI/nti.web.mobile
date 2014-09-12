/** @jsx React.DOM */
'use strict';

var Promise = global.Promise || require('es6-promise').Promise;

var React = require('react/addons');
var getService = require('../Utils').getService;

module.exports = React.createClass({
	displayName: 'DisplayName',

	getInitialState: function() {
		return {
			displayName: 'Resolving...'
		};
	},


	componentDidMount: function() {
		this._resolve(this.props);
	},


	componentWillReceiveProps: function(nextProps) {
		this._resolve(nextProps);
	},


	_resolve: function(props) {
		//Please do not repeat this pattern... this is a quicky for now kind of thing.
		var me = this;
		var username = props.username;
		var user = props.user;
		var promise;

		if (!username && !user) {
			promise = Promise.reject();
		}

		promise = promise || (user && Promise.resolve(user));

		if (!promise) {
			promise = getService()
				.then(function(service) { return service.resolveUser(username); });
		}

		promise.then(
				function resolved(user) {
					me.setState({ displayName: user.DisplayName });
				},
				function failed() {
					me.setState({ displayName: 'Unknown' });
				});
	},


	render: function() {
		var username = this.props.username;
		var displayName = this.state.displayName;
		return (
			<span data-for={username}>{displayName}</span>
		);
	}
});
