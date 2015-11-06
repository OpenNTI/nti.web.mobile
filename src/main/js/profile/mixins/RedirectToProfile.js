import BasePath from 'common/mixins/BasePath';
import Navigatable from 'common/mixins/NavigatableMixin';
import {profileHref} from './ProfileLink';
import {join} from 'path';


export default {

	mixins: [BasePath, Navigatable],

	redirectToProfile (extraPath) {
		let link = profileHref();
		let memberships = join(this.getBasePath(), link, extraPath || '');
		this.navigateRoot(memberships);
	}

};
