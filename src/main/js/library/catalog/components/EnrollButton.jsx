/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var EnrollmentOptions = require('../mixins/EnrollmentMixin');
var EnrollmentStore = require('enrollment/Store');
var Loading = require('common/components/Loading');

/**
* Displays a link/button to enroll if enrollment options are
* available for the given catalog entry.
*/
var EnrollButton = React.createClass({

	mixins: [NavigatableMixin,EnrollmentOptions],

	componentDidMount: function() {
		var courseId = this.props.catalogEntry.CourseNTIID;
		EnrollmentStore.isEnrolled(courseId).then(function(result) {
			this.setState({
				loading: false,
				enrolled: result
			});
		}.bind(this));
	},

	propTypes: {
		'catalogEntry': React.PropTypes.object.isRequired
	},

	render: function() {

		if(this.state.loading) {
			return <Loading />;
		}

		if (this.state.enrolled) {
			var href = this.makeHref('/enrollment/drop/', true);
			return <a href={href} className="tiny button radius">Drop This Course</a>;
		}

		if (this.enrollmentOptions(this.props.catalogEntry).length > 0) {
			var href = this.makeHref('/enrollment/', true);
			return <a href={href} className="tiny button radius">Enroll</a>;
		}

		return null;
	}

});

module.exports = EnrollButton;
