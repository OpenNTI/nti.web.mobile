/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Button = require('../../common/components/forms/Button');
var LoginConstants = require('../LoginConstants');
var t = require('../../common/locale');

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

			// shortcut for getting the service name off the oauth constants
			// (e.g. 'google' from 'OAUTH_LINK_GOOGLE')
			function _serviceName(k) {
				return k.split('_').pop().toLowerCase();
			}

			if(LoginConstants[key] in props.links) {
				buttons.push(
					<Button className={key} onClick={_buttonClick} key={key}>
						{t('oauth.login',{service:_serviceName(key)})}
					</Button>
				);
			}
		});

		return (
			<div>
				<div>
				{buttons}</div>
			</div>
		);
	}
});
