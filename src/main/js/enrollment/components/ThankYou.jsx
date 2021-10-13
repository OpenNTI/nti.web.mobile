import createReactClass from 'create-react-class';

import { Loading } from '@nti/web-commons';
import LibraryAccessor from 'internal/library/mixins/LibraryAccessor';

export default createReactClass({
	displayName: 'ThankYou, No THANK YOU',
	//The LibraryAccessor mixin gives us the 'getLibrary' method.
	mixins: [LibraryAccessor],

	render() {
		const {
			state: { loading },
		} = this;
		const library = this.getLibrary();

		//We DEPEND on the library being reloaded by the enrollment proccess.
		//If the library has not be triggered to reload by the time this
		//component is mounted/rendered, then the getLastEnrolledCourse will
		//return the WRONG value.

		const { VendorThankYouPage: { thankYouURL } = {} } =
			library.getLastEnrolledCourse() || {};

		//If the library is loading, or reloading this will be true.
		if (loading) {
			return <Loading.Mask />;
		}

		return thankYouURL ? (
			<iframe src={thankYouURL} className="thankyou" frameBorder="0" />
		) : (
			<noscript />
		);
	},
});
