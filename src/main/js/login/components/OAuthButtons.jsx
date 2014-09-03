/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Button = require('../../common/components/forms/Button');
var LoginConstants = require('../LoginConstants');
var t = require('../../common/locale');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
		authlinks.forEach(function(link_key) {

			// shortcut for getting the service name off the oauth constants
			// (e.g. 'google' from 'OAUTH_LINK_GOOGLE')
			function _serviceName(k) {
				return k.split('_').pop().toLowerCase();
			}

			if(LoginConstants[link_key] in props.links) {
				buttons.push(
					<Button className={link_key.toLowerCase()} key={link_key} onClick={_buttonClick} link_key={link_key}>
						{t('oauth.login',{service:_serviceName(link_key)})}
					</Button>
				);
			}
		});

		return (
			<div>
				<div>
				 <ReactCSSTransitionGroup transitionName="button">{buttons}</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}
});
