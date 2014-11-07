/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var EnrollmentOptions = require('../mixins/EnrollmentMixin');
var EnrollmentStore = require('enrollment/Store');
var Loading = require('common/components/Loading');


var buttonCss = "tiny button radius column";

/**
* Displays a link/button to enroll if enrollment options are
* available for the given catalog entry.
*/
var EnrollButton = React.createClass({

	mixins: [EnrollmentOptions],

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

	_button: function() {

		if (this.state.enrolled) {
			var href = this.makeHref('/enrollment/drop/', true);
			return <a href={href} className={buttonCss}>Drop This Course</a>;
		}

		if (this.enrollmentOptions(this.props.catalogEntry).length > 0) {
			var href = this.makeHref('/enrollment/', true);
			return <a href={href} className={buttonCss}>Enroll</a>;
		}
	},

	render: function() {

		if(this.state.loading) {
			return <Loading />;
		}

		var button = this._button();
		if (button) {
			return <div className="row"><div className="cell small-12 columns">{button}</div></div>;
		}

		return null;
	}

});

module.exports = EnrollButton;
