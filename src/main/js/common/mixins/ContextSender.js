import Contributor from './ContextContributor';

import {setPageSource, setContext} from 'navigation/Actions';

export default {
	mixins: [Contributor],


	componentDidMount () {
		if (!this.getContext) {
			this.getContext = ()=> Promise.resolve([]);
			console.warn('Missing getContext implementation, adding empty no-op.');
		}

		setContext(this);
	},


	setPageSource (pageSource, currentPage) {
		setPageSource(pageSource, currentPage, this);
	}
};
