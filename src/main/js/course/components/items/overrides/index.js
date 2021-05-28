import Registry from './Registry';
import Page from './Page';

import './Assignment';
import './Reading';
import './Timeline';
import './Topic';
import './Video';

//TODO: These two look like they can be deleted now that the below auto-wrapping handler is in place
import './Scorm';
import './Webinar';

export default Registry.getInstance();

Registry.register((item, registration) => {
	if (registration && !registration.default) {
		if (!Registry.getItem(item)) {
			const Handler = registration.handler;
			// console.log('New Wrapped component', Handler);
			Registry.register(registration.key, props => (
				<Page {...props}>
					<Handler {...props} />
				</Page>
			));
		}
	}
}, null);
