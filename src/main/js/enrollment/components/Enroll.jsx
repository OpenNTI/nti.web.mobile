import React from 'react';

import Err from 'common/components/Error';
import ContextSender from 'common/mixins/ContextSender';
import {scoped} from 'nti-lib-locale';

import EnrollmentOptions from '../mixins/EnrollmentMixin';

let t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'Enroll',
	mixins: [EnrollmentOptions, ContextSender],

	getCourseTitle () {
		let e = this.getEntry();
		return e ? e.Title : 'Unknown';
	},


	getContext () {
		return Promise.resolve([
			{
				label: t('enrollTitle')
			}
		]);
	},


	render () {

		if (this.state.error) {
			return <Err error={this.state.error} />;
		}

		const {icon} = this.getEntry() || {};
		const title = this.getCourseTitle();

		return (
			<div className="enrollment-options">
				{icon && (
					<div className="content-banner">
						<img src={icon} />
						<label>
							<h3>{title}</h3>
						</label>
					</div>
				)}
				{this.enrollmentWidgets()}
			</div>
		);
	}

});
