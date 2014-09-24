/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var getService = require('common/Utils').getService;

var Loading = require('common/components/Loading');
var DisplayName = require('common/components/DisplayName');
var Avatar = require('common/components/Avatar');

var Notifications = require('../../notifications');

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
		console.log("---resolve");
		if (!this.state.appUser) {
			getService()
				.then(function(service){
					var toreturn = service.getAppUser();
					console.log("---getService.then");
					console.log(service);
					console.log(toreturn);
					return service.getAppUser();
				})
				.then(function(user) {
					console.log("---getService.then.then");
					console.log(user);
					this.setState({appUser: user});
				}.bind(this))
				.catch(function(error) {
					console.log("ERROR");
					console.log(error);
					console.log(error.stack);
				});
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

		//<Avatar username={username} width="64" height="64"/> <DisplayName username={username}/>
		return (
			<div>
				<Avatar username={username} width="64" height="64"/> <DisplayName username={username}/>
			</div>
		);
	}
});
