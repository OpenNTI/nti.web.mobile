

var React = require('react');
var PanelButton = require('common/components/PanelButton');
var t = require('common/locale').translate;

var NoOptions = React.createClass({

	render: function() {
		return (
			<PanelButton href="../" linkText={t('BUTTONS.ok')}>
				This course is not currently available for enrollment.
			</PanelButton>
		);
	}

});

module.exports = NoOptions;
