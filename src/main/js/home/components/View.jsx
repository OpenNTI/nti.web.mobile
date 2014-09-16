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
		//The DisplayName component can use the full User instance if you
		//have it. Otherwise, it will take a username prop. If you do not have
		//the full user object, and you want to show the display name, do not
		//resolve the full user object yourself just to pass to this
		//componenent. Only resolve the user IF and ONLY IF you need it for
		//something else. Most likely. If its a link, or something, use the
		//corresponding Component, do not roll your own.

		return (
			<div>
				<Avatar username={username} width="32" height="32"/> <DisplayName user={this.state.appUser}/>
			</div>
		);
	}
});
