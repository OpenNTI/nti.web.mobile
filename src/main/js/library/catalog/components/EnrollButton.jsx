/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var EnrollmentOptions = require('../mixins/EnrollmentMixin');

var EnrollButton = React.createClass({

	mixins: [NavigatableMixin,EnrollmentOptions],

	propTypes: {
		'catalogEntry': React.PropTypes.object.isRequired
	},

	render: function() {

		if (this._enrollmentOptions(this.props.catalogEntry).length > 0) {
			var href = this.makeHref('/enrollment/', true);
			return <a href={href} className="tiny button radius">Enroll</a>;
		}

		return null;
	}

});

module.exports = EnrollButton;
