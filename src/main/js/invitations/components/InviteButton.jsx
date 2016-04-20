import React from 'react';
import {encodeForURI} from 'nti-lib-ntiids';

import {scoped} from 'common/locale';
import BasePath from 'common/mixins/BasePath';

import {canSend} from '../Api';

const t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'Invitations:InviteButton',

	mixins: [BasePath],

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	href () {
		const {course} = this.props;
		const courseId = encodeForURI(course.getID());
		return `${this.getBasePath()}invitations/send/${courseId}`;
	},

	render () {

		const {course} = this.props;

		return canSend(course) ? <a className="invite-button" href={this.href()}>{t('inviteButton')}</a> : null;
	}
});
