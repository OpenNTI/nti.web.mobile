/** @jsx React.DOM */
'use strict';

var Promise = global.Promise || require('es6-promise').Promise;

var React = require('react/addons');
var getService = require('../Utils').getService;

/**
 * This DisplayName component can use the full User instance if you have it.
 * Otherwise, it will take a username prop. If you do not have the full user
 * object, and you want to show the display name, do not resolve the full user
 * object yourself just to pass to this componenent. Only resolve the user IF
 * and ONLY IF you need it for something else. Most likely. If its a link, or
 * something, use the corresponding Component, do not roll your own.
 */
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
			<span data-for={username} className='username'>{displayName}</span>
		);
	}
});
