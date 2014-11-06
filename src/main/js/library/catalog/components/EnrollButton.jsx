/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var EnrollmentOptions = require('../mixins/EnrollmentMixin');

/**
* Displays a link/button to enroll if enrollment options are
* available for the given catalog entry.
*/
var EnrollButton = React.createClass({

	mixins: [NavigatableMixin,EnrollmentOptions],

	propTypes: {
		'catalogEntry': React.PropTypes.object.isRequired
	},

	render: function() {

		if (this.enrollmentOptions(this.props.catalogEntry).length > 0) {
			var href = this.makeHref('/enrollment/', true);
			return <a href={href} className="tiny button radius">Enroll</a>;
		}

		return null;
	}

});

module.exports = EnrollButton;
