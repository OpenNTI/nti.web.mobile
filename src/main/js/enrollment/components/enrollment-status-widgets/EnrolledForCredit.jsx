import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import {DateTime, Mixins} from 'nti-web-commons';

import Mixin from './mixin';


export default createReactClass({
	displayName: 'EnrolledForCredit',

	mixins: [Mixins.BasePath, Mixin],

	propTypes: {
		catalogEntry: PropTypes.object.isRequired
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
