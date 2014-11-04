/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Button = require('./Button');
var t = require('common/locale').scoped('LOGIN');
var MESSAGE = require('../Constants').messages.SIGNUP_CONFIRMATION;

var SignupConfirm = React.createClass({

	render: function() {
		return (
			<div>
				<div className="notice simple">
					{t(MESSAGE)}
				</div>
				<div className="medium-6 medium-centered columns">
					<Button href="/signup/">Create Account <i className="fi-arrow-right" /></Button>
					<Button href="/" className="fi-arrow-left"> Return to Login</Button>
				</div>
			</div>
		);
	}

});

module.exports = SignupConfirm;
