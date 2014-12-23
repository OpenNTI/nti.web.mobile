'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var t = require('common/locale').scoped('ENROLLMENT');

var FiveMinuteEnrollment = React.createClass({

	statics: {
		re: /FiveMinuteEnrollment/i,//The server sends lower case M, but we're comparing case-insensitively.
		handles: function (options) {
			return this.re.test(options && options.key);
		}
	},

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
