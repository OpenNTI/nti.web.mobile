import BasePath from 'common/mixins/BasePath';
import Navigatable from 'common/mixins/NavigatableMixin';
import {makeHref as profileLink} from '../components/ProfileLink';
import {join} from 'path';


export default {

	mixins: [BasePath, Navigatable],

	redirectToProfile() {
		let link = profileLink();
		let memberships = join(this.getBasePath(), link, 'memberships/');
		this.navigateRoot(memberships);
	}

};
