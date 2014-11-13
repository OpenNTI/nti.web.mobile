/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

var PaymentError = React.createClass({

	mixins: [NavigatableMixin],

	render: function() {
		return (
			<div className="small-12 columns">
				<PanelButton className="error" href='../../../'>
					<p>We were unable to process you enrollment for '{this.props.courseTitle}'.</p>
					<p>Please try again. If this issue persists contact support.</p>
				</PanelButton>
			</div>
		);
	}

});

module.exports = PaymentError;
