import React from 'react';

import {DateTime} from 'nti-web-commons';
import BasePath from 'common/mixins/BasePath';

import Mixin from './mixin';


export default React.createClass({
	displayName: 'EnrolledForCredit',

	mixins: [BasePath, Mixin],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired
	},

	render () {
		const {catalogEntry} = this.props;
		const href = this.enrollmentHref(this.getBasePath(), catalogEntry);
		return (
			<div className="enrollment-status-credit">
				<div>
					<div className="heading">You're Enrolled for credit</div>
					<div className="content">
						Class begins <DateTime date={catalogEntry.getStartDate()} /> and will be conducted fully online.
					</div>
				</div>
				<div className="status">
					<span className="registered">You are registered</span>
					<a href={href} className="edit">Edit</a>
				</div>
			</div>
		);
	}
});
