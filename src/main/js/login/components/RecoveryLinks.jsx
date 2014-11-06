/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var t = require('common/locale').scoped('LOGIN');
var Link = require('react-router-component').Link;

var React = require('react/addons');

module.exports = React.createClass({

	render: function() {

		var cssClasses = "tiny button radius small-12 columns";

		return (
			<div>
				<Link id="login:forgot:username" className={cssClasses} href="/forgot/username">{t('forgot.username')}</Link>
				<Link id="login:forgot:password" className={cssClasses} href="/forgot/password">{t('forgot.password')}</Link>
			</div>
		);
	}

});
