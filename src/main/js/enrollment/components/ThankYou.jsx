import React from 'react';

import Loading from 'common/components/Loading';
import LibraryAccessor from 'library/mixins/LibraryAccessor';

export default React.createClass({
	displayName: 'ThankYou, No THANK YOU',
	//The LibraryAccessor mixin gives us the 'getLibrary' method.
	mixins: [LibraryAccessor],

	render () {
		const {state: {loading}} = this;
		const library = this.getLibrary();

		//We DEPEND on the library being reloaded by the enrollment proccess.
		//If the library has not be triggered to reload by the time this
		//component is mounted/rendered, then the getLastEnrolledCourse will
		//return the WRONG value.

		const {VendorThankYouPage: {thankYouURL} = {}} = library.getLastEnrolledCourse();


		//If the library is loading, or reloading this will be true.
		if (loading) {
			return ( <Loading/> );
		}

		return thankYouURL ? (
			<iframe src={thankYouURL} className="thankyou" frameBorder="0"/>
		) : (
			<noscript/>
		);
	}
});
