import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {encodeForURI} from 'nti-lib-ntiids';
import {scoped} from 'nti-lib-locale';
import {Mixins} from 'nti-web-commons';

import {canSend} from '../Api';

const t = scoped('invitations.view', {
	inviteButton: 'Invite someone to this course',
});

export default createReactClass({
	displayName: 'Invitations:InviteButton',

	mixins: [Mixins.BasePath],

	propTypes: {
		course: PropTypes.object.isRequired
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
