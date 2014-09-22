/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Button = require('common/components/forms/Button');
var LinkConstants = require('../Constants').links;
var t = require('common/locale').scoped('LOGIN.forgot');
var Dataserver = require('dataserverinterface');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var React = require('react/addons');

var RecoveryLink = React.createClass({

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
				{t(lkey)} - {this.props.link}
			</Button>
		);
	}
});

module.exports = React.createClass({

	render: function() {

		// filter the list of LoginConstants to include those that
		// contain 'forgot' or 'recover'
		var recoverylinks = Object.keys(LinkConstants).filter(function(k) {
			return /forgot|recover/.test(LinkConstants[k]);
		});

		var buttons = [];
		var props = this.props;

		recoverylinks.forEach(function(link_key) {
			var link = LinkConstants[link_key];
			if (link in props.links) {
				buttons.push(
					<RecoveryLink link_key={link_key} link={props.links[link]} />
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
