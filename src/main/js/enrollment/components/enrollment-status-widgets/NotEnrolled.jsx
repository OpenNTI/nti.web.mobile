import React from 'react';

import BasePath from 'common/mixins/BasePath';

import Mixin from './mixin';


export default React.createClass({
	displayName: 'NotEnrolled',

	mixins: [BasePath, Mixin],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired
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
				{hasOptions && (<a className="button tiny" href={href}>Enroll</a>)}
			</div>
		);
	}
});
