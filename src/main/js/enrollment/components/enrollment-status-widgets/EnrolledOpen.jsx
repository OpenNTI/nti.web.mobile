import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Mixins } from '@nti/web-commons';

import Mixin from './mixin';

export default createReactClass({
	displayName: 'EnrolledOpen',

	mixins: [Mixins.BasePath, Mixin],

	propTypes: {
		catalogEntry: PropTypes.object.isRequired,
	},

	render() {
		const { catalogEntry } = this.props;
		const href = this.enrollmentHref(this.getBasePath(), catalogEntry);
		return (
			<div className="enrollment-status-open">
				<div className="status">
					<span className="registered">You are registered</span>
					<a href={href} className="edit">
						Edit
					</a>
				</div>
			</div>
		);
	},
});
