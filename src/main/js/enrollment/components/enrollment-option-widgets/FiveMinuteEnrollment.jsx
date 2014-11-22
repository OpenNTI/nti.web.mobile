/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelNoButton = require('common/components/PanelNoButton');
var t = require('common/locale').scoped('ENROLLMENT');

var FiveMinuteEnrollment = React.createClass({

	render: function() {
		return (
			<PanelNoButton>
				<h2>{t('fiveMinuteEnrollmentTitle')}</h2>
				<p>{t('fiveMinuteNotAvailableOnMobile')}</p>
			</PanelNoButton>
		);
	}

});

module.exports = FiveMinuteEnrollment;
