import React from 'react/addons';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import NavigationBar from 'navigation/components/Bar';

import Head from './Head';


let Content = React.createClass({
	displayName: 'Profile:Content',
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
			<Head {...this.props} />
		);
	}
});


export default React.createClass({
	displayName: 'profile:View',

	render () {
		return (
			<div className="profile">
				<NavigationBar title="Profile" />
				<Content {...this.props}/>
			</div>
		);
	}
});
