import React from 'react';
import createReactClass from 'create-react-class';
import {Contact} from 'nti-web-help';
import {Mixins} from 'nti-web-commons';
import {getHistory} from 'nti-web-routing';

import Page from 'common/components/Page';
import ContextSender from 'common/mixins/ContextSender';

const routerHistory = getHistory();

export default createReactClass({
	displayName: 'ContactUs',

	mixins: [Mixins.BasePath, ContextSender],

	getContext () {
		let path = this.getBasePath();

		return Promise.resolve([{
			label: 'Catalog',
			href: path + 'catalog'
		},{
			label: 'Contact Us',
			href: path + 'contact-us/'
		}]);
	},


	onCancel () {
		routerHistory.goBack(); //TODO: this needs to be smarter about where to go back to
	},


	render () {
		return (
			<Page title="Contact Us" border>
				<div className="contact-us-container">
					<Contact onDismiss={this.onCancel} />
				</div>
			</Page>
		);
	}
});
