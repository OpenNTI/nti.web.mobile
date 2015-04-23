import React from 'react';

import PanelButton from 'common/components/PanelButton';
import {scoped} from 'common/locale';

import {enrollOpen} from '../../Actions';

const t = scoped('ENROLLMENT.BUTTONS');

export default React.createClass({
	displayName: 'OpenEnrollmentWidget',

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,
		enrollmentOption: React.PropTypes.object.isRequired
	},

	statics: {
		re: /OpenEnrollment/i,
		handles (options) {
			return this.re.test(options && options.key);
		}
	},

	enroll (event) {
		event.preventDefault();
		enrollOpen(this.props.catalogEntry.getID());
	},

	render () {
		return (
			<PanelButton onClick={this.enroll} linkText={t(this.props.enrollmentOption.key)}>
				<h2>Enroll for Free</h2>
				<p>Get complete access to interact with all course content, including lectures, course materials, quizzes, and discussions once class is in session.</p>
			</PanelButton>
		);
	}

});
