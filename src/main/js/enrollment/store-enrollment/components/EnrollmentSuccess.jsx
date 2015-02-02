
'use strict';

var React = require('react/addons');

var PanelButton = require('common/components/PanelButton');
var Utils = require('common/Utils');

//var _t = require('common/locale').translate;

module.exports = React.createClass({
	displayName: 'EnrollmentSuccess',

	propTypes: {
		courseTitle: React.PropTypes.string,
	},

	render: function() {
		var basePath = Utils.getBasePath();
		return (
			<div className="small-12 columns">
				<PanelButton href={basePath + 'library/courses/'} linkText="Go to my courses">
					You are now enrolled in {this.props.courseTitle}.
				</PanelButton>
			</div>
		);
	}
});
