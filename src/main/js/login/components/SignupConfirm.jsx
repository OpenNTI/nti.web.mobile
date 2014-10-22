/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react/addons');
var Link = require('react-router-component').Link;
var Button = require('./Button');

var SignupConfirm = React.createClass({

	render: function() {
		return (
			<div className="medium-6 medium-centered columns">
				<div className="notice">
					If you are a current student at the University of Oklahoma, you don't need to create an account. <Link href="/">Log in with your OUNet ID (4+4)</Link>
				</div>
				<Button href="/signup/">Create Account <i className="fi-arrow-right" /></Button>
				<Button href="/" className="fi-arrow-left"> Return to Login</Button>
			</div>
		);
	}

});

module.exports = SignupConfirm;
