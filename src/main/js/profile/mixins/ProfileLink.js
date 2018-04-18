import Logger from '@nti/util-logger';
import {User, getAppUsername} from '@nti/web-client';
import {Mixins} from '@nti/web-commons';

const logger = Logger.get('profile:mixins:ProfileLink');

export function profileHref (id = getAppUsername()) {
	id = id && id.getID ? id.getID() : id;
	return (`profile/${User.encode(id)}/`).replace(/\/\//g, '/');
}

export default {
	mixins: [Mixins.BasePath, Mixins.NavigatableMixin],

	profileHref (entity = this.props.entity) {
		return `${this.getBasePath()}${profileHref(entity)}`;
	},

	navigateToProfile (entity = this.props.entity) {
		if (!entity) {
			logger.warn('No entity provided for ProfileLink. Ignoring.');
			return;
		}

		this.navigateRoot(this.profileHref(entity));
	}

};
