import React from 'react';

import QueryString from 'query-string';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';

import CatalogAccessor from 'catalog/mixins/CatalogAccessor';
import Detail from 'catalog/components/Detail';

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
		let message = 'You have successfully enrolled!';
		let cls = 'enrollment-failed';
		let buttonCls = 'button tiny';
		let library = this.getBasePath() + 'library/';

		if (!this.state.paymentState) {

			message = 'Payment was not processed.';

		}
		else if (!this.props.enrollment.enrolled) {

			message = 'You were not enrolled.';

		} else {
			cls = 'enrollment-success';
			entry = this.getEntry();
		}

		return (
			<div className={cls}>

				<figure className="notice">
					<div>{message}</div>
				</figure>

				{entry ? (
					<a className={buttonCls} href={library}>Go to my courses</a>
				) : (
					<a className={buttonCls} href={this.getBasePath()}>Go Home</a>
				)}

				{entry && ( <Detail entry={entry}/> )}

				{entry && ( <a className={buttonCls} href={library}>Go to my courses</a> )}
			</div>
		);
	}

});
