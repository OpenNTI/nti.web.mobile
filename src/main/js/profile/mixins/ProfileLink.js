import {encode} from 'common/utils/user';
import {getAppUsername} from 'common/utils';

import BasePathAware from 'common/mixins/BasePath';
import Navigatable from 'common/mixins/NavigatableMixin';

export function profileHref (id = getAppUsername()) {
	id = id && id.getID ? id.getID() : id;
	return (`profile/${encode(id)}/`).replace(/\/\//g, '/');
}

export default {
	mixins: [BasePathAware, Navigatable],

	profileHref (entity = this.props.entity) {
		return `${this.getBasePath()}${profileHref(entity)}`;
	},

	navigateToProfile (entity = this.props.entity) {
		if (!entity) {
			console.warn('No entity provided for ProfileLink. Ignoring.');
			return;
		}

		this.navigateRoot(this.profileHref(entity));
	}

};
