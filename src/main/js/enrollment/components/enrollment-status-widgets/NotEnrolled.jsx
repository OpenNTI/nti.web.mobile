import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Mixins} from '@nti/web-commons';

import Mixin from './mixin';


export default createReactClass({
	displayName: 'NotEnrolled',

	mixins: [Mixins.BasePath, Mixin],

	propTypes: {
		catalogEntry: PropTypes.object.isRequired
	},

	hasOptions (catalogEntry) {
		function available (option) {
			return (option || {}).available;
		}
		return catalogEntry && Object.values(catalogEntry.getEnrollmentOptions().Items).some(available);
	},

	render () {
		const {catalogEntry} = this.props;
		const hasOptions = this.hasOptions(catalogEntry);
		const href = this.enrollmentHref(this.getBasePath(), catalogEntry);

		return (
			<div className="enrollment-status-none">
				{hasOptions && (<a className="button large" href={href}>Enroll</a>)}
			</div>
		);
	}
});
