/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Button = require('../../common/components/forms/Button');
var LoginConstants = require('../LoginConstants');
// var i18n = require('i18n');

function _buttonClick(evt) {
	console.log('oauth button click: %O', evt);
}

module.exports = React.createClass({

	render: function() {
		var authlinks = Object.keys(LoginConstants).filter(function(k) {
			return k.indexOf('OAUTH_LINK') == 0;
		});

		var buttons = [];
		var test = [];

		var props = this.props;
		authlinks.forEach(function(key) {
			console.log('%s', key);
			console.log('%O', props);
			if(LoginConstants[key] in props.links) {
				buttons.push(<Button onClick={_buttonClick}>{key}</Button>);
			}
		});

		return (
			<div>
				<div>{buttons}</div>
			</div>
		);
	}
});
