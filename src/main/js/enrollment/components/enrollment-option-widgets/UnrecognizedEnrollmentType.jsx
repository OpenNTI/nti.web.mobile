import React from 'react';

export default React.createClass({
	displayName: 'UnrecogzniedEnrollmentType',

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,
		enrollmentOption: React.PropTypes.object.isRequired
	},

	render () {
		console.warn('Not rendering UnrecogzniedEnrollmentType: %s %O', this.props.enrollmentOption.key, this.props.enrollmentOption);
		return null;
	}

});
