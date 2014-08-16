/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var LoginController = require('../LoginController');
var LoginActions = require('../LoginActions');
var LoginConstants = require('../LoginConstants');
var Button = require('../../common/components/forms/Button');

var LoginForm = React.createClass({

	getInitialState: function() {
		return {
			username: '',
			password: ''
		};
	},

	handleSubmit: function(event) {
		var username = this.refs.username.state.value;
		var pw = this.refs.password.state.value;
		LoginActions.log_in({username: username, password:pw});
	},

	render: function() {
		var links = [];
		for(var item in LoginController.state.links) {
			links.push(<li key={item}>{item}:  <div>{LoginController.getHref(item)}</div></li>);
		}

		debugger;
		return (
			<div className="row">
				<form className="login-form large-6 large-centered columns" onSubmit={this.handleSubmit}>
					<fieldset>
						<input type="text" ref="username" placeholder="Username" defaultValue={this.state.username} />
						<input type="password" ref="password" placeholder="Password" defaulValue={this.state.password} />
						<Button className={this.props.submitEnabled ? '' : 'disabled'} onClick={this.props.submitEnabled ? this.handleSubmit : function(){return false}}>Log In</Button>
					</fieldset>
				</form>
				<div style={{color:'lightgray'}}>
					<h3>debug</h3>
					<div>enabled ? {this.props.submitEnabled ? 'true' : 'false'}</div>
					LOGIN_PASSWORD_LINK: '{LoginController.getHref(LoginConstants.LOGIN_PASSWORD_LINK)}'
					<ul>
						{links}
					</ul>
				</div>
			</div>
		);
	}
});

var LoginPanel = React.createClass({

	componentDidMount: function() {
		// LoginController.addChangeListener(this._onChange);
		LoginActions.begin();
	},

	// componentWillUnmount: function() {
	// 	LoginController.removeChangeListener(this._onChange);
	// },

	render: function() {
		return (
			<div className="login-panel">
				<LoginForm submitEnabled={LoginController.canDoPasswordLogin()}/>
			</div>
		);
	},

	// _onChange: function() {
	// 	console.log('LoginPanel::onChange invoked');
	// }

});

module.exports = LoginPanel;
