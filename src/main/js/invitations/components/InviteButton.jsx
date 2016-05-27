import React from 'react';
import {encodeForURI} from 'nti-lib-ntiids';

import {scoped} from 'nti-lib-locale';
import {Mixins} from 'nti-web-commons';

import {canSend} from '../Api';

const t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'Invitations:InviteButton',

	mixins: [Mixins.BasePath],

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	href () {
		const {course} = this.props;
		const courseId = encodeForURI(course.getID());
		return `${this.getBasePath()}course/${courseId}/invite/`;
	},

	render () {

		const {course} = this.props;

		return canSend(course) ? <a className="invite-button" href={this.href()}>{t('inviteButton')}</a> : null;
	}
});
