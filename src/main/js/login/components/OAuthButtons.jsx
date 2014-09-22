/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Button = require('common/components/forms/Button');
var LinkConstants = require('../Constants').links;
var t = require('common/locale');
var Dataserver = require('dataserverinterface');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var React = require('react/addons');

// shortcut for getting the service name off the oauth constants
// (e.g. 'google' from 'OAUTH_LINK_GOOGLE')
function _serviceName(k) {
	return k.split('_').pop().toLowerCase();
}

var OAuthButton = React.createClass({

	render: function() {
		// link_key is the property name of the link (as in 'logon.google').
		// 'key' is used by react components as an identifier so we use this
		// admittedly clumsy alternative 'link_key'.
		var lkey = this.props.link_key;
		var base = encodeURIComponent(this.props.basePath);
		return (
			<Button
				href={this.props.link + '&success=' + base + '&failure=' + base}
				className={lkey.toLowerCase()}
				key={lkey}
			>
				{t('LOGIN.oauth.login',{service:_serviceName(lkey)})}
			</Button>
		);
	}
});

module.exports = React.createClass({

	render: function() {

		// filter the list of LoginConstants to include those that
		// begin with OAUTH_LINK
		var authlinks = Object.keys(LinkConstants).filter(function(k) {
			return k.indexOf('OAUTH_LINK') == 0;
		});

		var buttons = [];
		var props = this.props;

		authlinks.forEach(function(link_key) {

			if (LinkConstants[link_key] in props.links) {
				buttons.push(
					<OAuthButton link_key={link_key} link={props.links[LinkConstants[link_key]]} />
				);
			}
		});

		return (
			<div>
				<div><ReactCSSTransitionGroup transitionName="button">{buttons}</ReactCSSTransitionGroup></div>
			</div>
		);

	}

});
