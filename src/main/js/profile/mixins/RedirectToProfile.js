import {Mixins} from 'nti-web-commons';
import {profileHref} from './ProfileLink';
import {join} from 'path';


export default {

	mixins: [Mixins.BasePath, Mixins.NavigatableMixin],

	redirectToProfile (extraPath) {
		let link = profileHref();
		let memberships = join(this.getBasePath(), link, extraPath || '');
		this.navigateRoot(memberships);
	}

};
