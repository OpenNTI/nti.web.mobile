/** @jsx React.DOM */

'use strict';

var LoginStore = require('../LoginStore');
var LoginActions = require('../LoginActions');
var Button = require('../../common/components/forms/Button');

var React = require('react/addons');

var LoginView = React.createClass({

	getInitialState: function() {
		return {
			username:'',
			password:''
		};
	},

	componentDidMount: function() {
		debugger;
		console.log('LoginView::componentDidMount');
		LoginStore.addChangeListener(this._onLoginStoreChange);
		LoginActions.begin();
	},

	componentWillUnmount: function() {
		console.log('LoginView::componentWillUnmount');
		LoginStore.removeChangeListener(this._onLoginStoreChange);
	},

	render: function() {
		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<input type="text" ref="username" placeholder="Username" defaultValue={this.state.username} onChange={this._usernameChanged}/>
						<input type="password" ref="password" placeholder="Password" defaulValue={this.state.password} />
						<Button
							className={this.props.submitEnabled ? '' : 'disabled'}
							onClick={this.props.submitEnabled ? this.handleSubmit : function(){return false}}>Log In</Button>
					</fieldset>
				</form>
			</div>
		);
	},

	/**
	* onChange handler for the username field. Triggers LoginActions.update_links
	* @method usernameChanged
	*/
	_usernameChanged: function(event) {
		var username = this.refs.username.getDOMNode().value.trim();
		var password = this.refs.password.getDOMNode().value.trim();
		LoginActions.userInputChanged({
			credentials: {
				username:username,
				password:password	
			},
			event:event
		});
	},

	_handleSubmit: function() {
		console.log('LoginView::_handleSubmit');
	},

	_onLoginStoreChange: function() {
		console.log('LoginView::_onLoginStoreChange invoked');
	}

});

module.exports = LoginView;
