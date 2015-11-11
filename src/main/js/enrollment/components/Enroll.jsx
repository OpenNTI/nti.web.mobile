import React from 'react';

import Loading from 'common/components/Loading';
import Err from 'common/components/Error';
import ContextSender from 'common/mixins/ContextSender';
import {scoped} from 'common/locale';

import EnrollmentOptions from '../mixins/EnrollmentMixin';
import EnrollmentSuccess from './EnrollmentSuccess';

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

		if (!this.state.enrollmentStatusLoaded) {
			return <Loading />;
		}

		if(this.state.enrolled) {
			return <EnrollmentSuccess courseTitle={this.getCourseTitle()}/>;
		}

		let thumb = (this.getEntry() || {}).thumb;
		let title = this.getCourseTitle();

		return (
			<div className="enrollment-options">
				{thumb && (
					<div className="content-banner">
						<img src={thumb} />
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
