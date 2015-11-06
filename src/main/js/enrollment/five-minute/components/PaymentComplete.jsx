import React from 'react';

import QueryString from 'query-string';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';

import Loading from 'common/components/Loading';
import CatalogAccessor from 'catalog/mixins/CatalogAccessor';
import LibraryAccessor from 'library/mixins/LibraryAccessor';
import Detail from 'catalog/components/Detail';

import ThankYou from '../../components/ThankYou';


const Wrapper = React.createClass({
	mixins: [LibraryAccessor],

	render () {
		//If the library is loading, or reloading this will be true.
		if (this.state.loading) {
			return ( <Loading/> );
		}

		return (
			<div {...this.props}/>
		);
	}
});


export default React.createClass({
	displayName: 'PaymentComplete',
	mixins: [BasePathAware, CatalogAccessor],

	getInitialState () {
		return {};
	},

	propTypes: {
		entryId: React.PropTypes.string,
		courseId: React.PropTypes.string,
		enrollment: React.PropTypes.object
	},

	componentWillMount () {
		let {search = ''} = global.location || {};
		let query = QueryString.parse(search);

		let paymentState = /true/i.test(query.State || '');

		this.setState({paymentState});
	},


	getEntryId () {
		return decodeFromURI(this.props.entryId);
	},


	getEntry () {
		let catalog = this.getCatalog();

		return catalog && catalog.findEntry(this.getEntryId());
	},


	render () {
		let entry;
		let message = 'You are now enrolled.';
		let cls = 'enrollment-failed';
		let buttonCls = 'button tiny';
		let library = this.getBasePath() + 'library/';

		const {props: {enrollment}, state: {paymentState}} = this;

		if (!paymentState) {

			message = 'Payment was not processed.';

		}
		else if (enrollment && !enrollment.enrolled) {

			message = 'You were not enrolled.';

		} else {
			cls = 'enrollment-success';
			entry = this.getEntry();
		}

		return (
			<Wrapper className={cls}>

				<figure className="notice">
					<div>{message}</div>
				</figure>

				<ThankYou/>

				<a className={buttonCls} href={library}>Go to my courses</a>

				{entry && ( <Detail entry={entry}/> )}

			</Wrapper>
		);
	}

});
