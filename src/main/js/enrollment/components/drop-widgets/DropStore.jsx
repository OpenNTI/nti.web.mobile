

var React = require('react');
var PanelButton = require('common/components/PanelButton');

var DropStore = React.createClass({

	render: function() {
		return (
			<div className="column">
				<PanelButton linkText="Okay" href="../../">
					Please contact support to drop this course.
				</PanelButton>
			</div>
		);
	}

});

module.exports = DropStore;
