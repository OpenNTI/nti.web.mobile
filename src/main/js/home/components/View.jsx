/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var getService = require('../../common/Utils').getService;

var Loading = require('../../common/components/Loading');
var DisplayName = require('../../common/components/DisplayName');
var Avatar = require('../../common/components/Avatar');

module.exports = React.createClass({
	displayName: 'HomeView',

	getInitialState: function() {
		return {
			appUser: null
		};
	},


	componentDidMount: function() {
		this._resolve();
	},


	componentWillReceiveProps: function(nextProps) {
		this._resolve();
	},


	_resolve: function() {
		if (!this.state.appUser) {
			getService()
				.then(function(service){return service.getAppUser();})
				.then(function(user) {
					this.setState({appUser: user});
				}.bind(this));
		}
	},


	render: function() {
		if (!this.state.appUser) {
			return (<Loading/>);
		}

		var username = this.state.appUser.Username;

		return (
			<div>
				<Avatar username={username} width="32" height="32"/> <DisplayName username={username}/>
			</div>
		);
	}
});
