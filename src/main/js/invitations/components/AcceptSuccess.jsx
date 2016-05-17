import React from 'react';

import {scoped} from 'nti-lib-locale';
import BasePathAware from 'common/mixins/BasePath';

import CourseInfo from './CourseInfo';

let t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'Invitations:Success',

	mixins: [BasePathAware],

	propTypes: {
		instance: React.PropTypes.object.isRequired
	},

	render () {

		const {instance} = this.props;

		let library = this.getBasePath() + 'library/';
		return (
			<div className="invitation-success">
				<CourseInfo instance={instance} />
				<div className="button-row">
					<a href={library} className="button">{t('successLinkText')}</a>
				</div>
			</div>
		);
	}
});
