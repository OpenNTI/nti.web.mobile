'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var t = require('common/locale').translate;

var NoOptions = React.createClass({

	render: function() {
		return (
			<PanelButton href="../" linkText={t('BUTTONS.OK')}>
				This course is not currently available for enrollment.
			</PanelButton>
		);
	}

});

module.exports = NoOptions;
