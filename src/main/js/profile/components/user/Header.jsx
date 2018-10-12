import {User} from '@nti/web-profiles';
import {User as UserUtil} from '@nti/web-client';
import {Router, Route} from '@nti/web-routing';

export default Router.for([
	Route({
		path: '/',
		getRouteFor: (obj, context) => {
			if (!obj.isUser) { return; }

			const base = `/mobile/profile/${UserUtil.encode(obj.Username)}/`;

			if (context === 'about') {
				return `${base}about/`;
			}

			if (context === 'activity') {
				return `${base}activity/`;
			}

			if (context === 'achievements') {
				return `${base}achievements/`;
			}

			if (context === 'memberships') {
				return `${base}memberships/`;
			}

			if (context === 'transcripts') {
				return `${base}transcripts/`;
			}

			if (context === 'edit') {
				return `${base}edit/`;
			}

			return null;
		},
		component: User.Header})
]);
