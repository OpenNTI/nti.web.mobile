import React from 'react';
import createReactClass from 'create-react-class';
import {scoped} from 'nti-lib-locale';

import ContextSender from 'common/mixins/ContextSender';
import Redirect from 'navigation/components/Redirect';

import EnrollmentOptions from '../mixins/EnrollmentMixin';

const t = scoped('enrollment.view', {
	title: 'Enroll',
});

export default createReactClass({
	displayName: 'Enroll',
	mixins: [EnrollmentOptions, ContextSender],

	getCourseTitle () {
		let e = this.getEntry();
		return e ? e.Title : 'Unknown';
	},


	getContext () {
		return Promise.resolve([
			{
				label: t('title')
			}
		]);
	},


	render () {

		if (this.state.error) {
			return (<Redirect location="/" />);
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
