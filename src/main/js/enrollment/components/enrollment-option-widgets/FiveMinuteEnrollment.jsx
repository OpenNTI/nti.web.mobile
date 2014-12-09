/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var t = require('common/locale').scoped('ENROLLMENT');

var FiveMinuteEnrollment = React.createClass({

	render: function() {
		return (
			<PanelButton href="credit/" linkText={t('fiveMinuteEnrollmentButton')}>
				<h2>{t('fiveMinuteEnrollmentTitle')}</h2>
				<p>{t('fiveMinuteEnrollmentDescription')}</p>
			</PanelButton>
		);
	}

});

module.exports = FiveMinuteEnrollment;
