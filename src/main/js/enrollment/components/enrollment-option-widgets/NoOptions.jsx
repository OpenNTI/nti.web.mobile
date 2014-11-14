/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');

var NoOptions = React.createClass({

	render: function() {
		return (
			<PanelButton href="../"className="column" buttonText='Okay'>
				This course is not currently available for enrollment.
			</PanelButton>
		);
	}

});

module.exports = NoOptions;
