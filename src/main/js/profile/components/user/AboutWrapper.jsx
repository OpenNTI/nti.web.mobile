import {User} from '@nti/web-profiles';
import {User as UserUtil} from '@nti/web-client';
import {Router, Route} from '@nti/web-routing';

export default Router.for([
	Route({
		path: '/',
		getRouteFor: (obj, context) => {
			if (!(obj.isUser || obj.isGroup || obj.isCommunity)) { return; }

			if (obj.isCommunity) {
				return `mobile/community/${encodeURIComponent(obj.Username)}`;
			}

			return `mobile/profile/${UserUtil.encode(obj.Username)}/`;
		},
		component: User.About})
]);
