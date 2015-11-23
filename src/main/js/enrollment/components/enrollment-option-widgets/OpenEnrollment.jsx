import React from 'react';

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
		};
	},

	statics: {
		re: /openenrollmentoption/i,
		handles (option) {
			return this.re.test(option && option.MimeType);
		}
	},

	enroll (event) {
		event.preventDefault();
		event.stopPropagation();

		this.setState({ busy: true });

		enrollOpen(this.props.catalogEntry.getID());
	},

	render () {

		if (this.state.busy) {
			return <Loading />;
		}

		return (
			<div>
				<div className="enrollment open-enrollment">
					<h2 className="title">Enroll for Free</h2>
					<p className="description">Get complete access to interact with all course content, including lectures, course materials, quizzes, and discussions once class is in session.</p>
					<div className="actions">
						<a onClick={this.enroll}>{t('OpenEnrollment')}</a>
					</div>
				</div>
			</div>
		);
	}

});
