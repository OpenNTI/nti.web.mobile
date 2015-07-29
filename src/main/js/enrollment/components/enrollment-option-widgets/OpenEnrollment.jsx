import React from 'react';

import PanelButton from 'common/components/PanelButton';
import {scoped} from 'common/locale';
import Loading from 'common/components/Loading';

import {enrollOpen} from '../../Actions';

const t = scoped('ENROLLMENT.BUTTONS');

export default React.createClass({
	displayName: 'OpenEnrollmentWidget',

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			busy: false
		}
	},

	statics: {
		re: /openenrollmentoption/i,
		handles (option) {
			return this.re.test(option && option.MimeType);
		}
	},

	enroll (event) {
		event.preventDefault();
		this.setState({
			busy: true
		});
		enrollOpen(this.props.catalogEntry.getID());
	},

	render () {

		if (this.state.busy) {
			return <Loading />;
		}

		return (
			<PanelButton onClick={this.enroll} linkText={t('OpenEnrollment')}>
				<h2>Enroll for Free</h2>
				<p>Get complete access to interact with all course content, including lectures, course materials, quizzes, and discussions once class is in session.</p>
			</PanelButton>
		);
	}

});
