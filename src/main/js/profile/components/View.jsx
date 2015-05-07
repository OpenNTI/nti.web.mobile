import React from 'react/addons';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import NavigationBar from 'navigation/components/Bar';

import Head from './Head';


export default React.createClass({
	displayName: 'profile:View',
	mixins: [BasePathAware, ContextSender],

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
	},

	render () {
		return (
			<div className="profile">
				<NavigationBar title="Profile" />
				<Head {...this.props} />
			</div>
		);
	}
});
