/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Button = require('common/components/forms/Button');
var t = require('common/locale').scoped('LOGIN');
var Dataserver = require('dataserverinterface');
var Link = require('react-router-component').Link;

var React = require('react/addons');

module.exports = React.createClass({

	render: function() {

		var cssClasses = "tiny button radius small-12 columns";

		return (
			<div>
				<Link className={cssClasses} href="/forgot/username">{t('forgot.username')}</Link>
				<Link className={cssClasses} href="/forgot/password">{t('forgot.password')}</Link>
			</div>
		);
	}

});
