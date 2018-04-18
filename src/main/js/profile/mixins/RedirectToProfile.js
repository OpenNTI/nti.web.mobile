import {join} from 'path';

import {Mixins} from '@nti/web-commons';

import {profileHref} from './ProfileLink';


export default {

	mixins: [Mixins.BasePath, Mixins.NavigatableMixin],

	redirectToProfile (extraPath) {
		let link = profileHref();
		let memberships = join(this.getBasePath(), link, extraPath || '');
		this.navigateRoot(memberships);
	}

};
