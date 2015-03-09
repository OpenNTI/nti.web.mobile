import React from 'react/addons';

import Page from 'common/components/Page';
import BasePathAware from 'common/mixins/BasePath';

import Head from './Head';

export default React.createClass({
	displayName: 'profile:View',
	mixins: [BasePathAware],

	render () {
		return (
			<Page className="profile" title="Profile" contextProvider={this.getContext}>
				<Head {...this.props}/>
			</Page>
		);
	},


	getContext (/*props*/) {
		let path = this.getBasePath();
		return Promise.resolve([
			{
				href: path, label: 'Home'
			}, {
				href: location.href,
				label: 'Profile'
			}
		]);
	}
});
