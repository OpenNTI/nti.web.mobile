import React from 'react';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';
import {getEnvironment} from 'react-router-component/lib/environment/LocalStorageKeyEnvironment';


import DarkMode from 'common/components/DarkMode';
import Loading from 'common/components/Loading';
import Redirect from 'navigation/components/Redirect';

import Section from './Section';

import SectionMixin from '../mixins/SectionAware';
import BasePath from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Library:View',
	mixins: [BasePath, SectionMixin],

	getInitialState () {
		let env = getEnvironment('library');

		return {
			env,
			pickingDefault: true
		};
	},


	componentDidMount () {
		this.defaultSection().then(this.setDefaultSection);
	},


	setDefaultSection (name) {
		const get = v => `/${v}`;
		let {env} = this.state;
		let p = env.getPath();

		let available = this.getAvailableSections().map(get);

		if (p == null || !available.includes(p)) {
			env.setPath(get(name));
		}

		this.setState({
			pickingDefault: false,
			defaultSection: name
		});
	},


	render () {
		let {env} = this.state;
		let {pickingDefault, loading} = this.state;

		loading = loading || pickingDefault;

		return (
			<div>
				<DarkMode/>
				{loading ? (
					<Loading />
				) : (
					<Locations environment={env}>
						{this.getRoutes()}
					</Locations>
				)}
			</div>
		);
	},


	getRoutes () {
		let {defaultSection} = this.state;
		let sections = this.getSectionNames();

		let routes = sections.map(section =>
			<Location
				key={section}
				path={`/${section}(/*)`}
				handler={Section}
				section={section}
			/>
		);

		if (defaultSection) {
			routes.push(<DefaultRoute
				key="default"
				handler={Redirect}
				location={`/${defaultSection}`}
			/>);
		}

		return routes;
	}

});
