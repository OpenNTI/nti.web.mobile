/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var LoginController = require('../LoginController');
var LoginActions = require('../LoginActions');
var LoginConstants = require('../LoginConstants');
var DebugInfo = require('./DebugInfo');
var merge = require('react/lib/merge');
var Button = require('../../common/components/forms/Button');

/**
* Login Form React component
* @class LoginForm
*/
var LoginForm = React.createClass({displayName: 'LoginForm',

	getInitialState: function() {
		return {
			username: '',
			password: ''
		};
	},

	/**
	* Submit-handler for the html login form; Invokes LoginActions.log_in.
	* @method handleSubmit
	*/
	handleSubmit: function(event) {
		if(this.props.submitEnabled) {
			var username = this.refs.username.state.value;
			var pw = this.refs.password.state.value;
			LoginActions.logIn({username: username, password:pw});	
		}
		console.log(this.state.submitEnabled ? 'submitEnabled' : 'submit not enabled');
	},

	/**
	* onChange handler for the username field. Triggers LoginActions.update_links
	* @method usernameChanged
	*/
	usernameChanged: function(event) {
		var username = this.refs.username.getDOMNode().value.trim();
		var password = this.refs.password.getDOMNode().value.trim();
		LoginActions.emit(LoginConstants.LOGIN_FORM_CHANGED,{
			credentials: {
				username:username,
				password:password	
			},
			event:event
		});
	},

	render: function() {
		return (
			React.DOM.div( {className:"row"}, 
				React.DOM.form( {className:"login-form large-6 large-centered columns", onSubmit:this.handleSubmit}, 
					React.DOM.fieldset(null, 
						React.DOM.input( {type:"text", ref:"username", placeholder:"Username", defaultValue:this.state.username, onChange:this.usernameChanged}),
						React.DOM.input( {type:"password", ref:"password", placeholder:"Password", defaulValue:this.state.password} ),
						Button(
							{className:this.props.submitEnabled ? '' : 'disabled',
							onClick:this.props.submitEnabled ? this.handleSubmit : function(){return false}}, "Log In")
					)
				),
				DebugInfo(null )
			)
		);
	}
});

/**
* React component for housing LoginForm
* @class LoginPanel
*/
var LoginPanel = React.createClass({displayName: 'LoginPanel',

	componentDidMount: function() {
		LoginActions.begin();
	},

	render: function() {
		return (
			React.DOM.div( {className:"login-panel"}, 
				LoginForm( {submitEnabled:LoginController.canDoPasswordLogin()})
			)
		);
	}
});

module.exports = LoginPanel;
