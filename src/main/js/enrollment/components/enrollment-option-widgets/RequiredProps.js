'use strict';

var React = require('react/addons');

/**
* propTypes expected by all enrollment-option-widgets.
*/
module.exports = {
	catalogEntry: React.PropTypes.object.isRequired,
	enrollmentOption: React.PropTypes.object.isRequired
};

