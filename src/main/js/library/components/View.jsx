import React from 'react';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';
import {getEnvironment} from 'react-router-component/lib/environment/LocalStorageKeyEnvironment';

import Loading from 'common/components/Loading';
import Redirect from 'navigation/components/Redirect';

import Section from './Section';
import SectionMixin from '../mixins/SectionAware';

export default React.createClass({
	displayName: 'Library:View',
	mixins: [SectionMixin],

	getInitialState () {
		let env = getEnvironment('library');
		if (env.getPath() == null) {
			env.setPath('');
		}
		return {
			env,
			loading: true
		};
	},


	componentDidMount () {
		this.defaultSection().then(this.setDefaultSection);
	},


	setDefaultSection (name) {
		this.setState({
			loading: false,
			defaultSection: name
		});
	},


	render () {
		if(this.state.loading) {
			return (<Loading />);
		}

		let {env} = this.state;
		return (
			<Locations environment={env}>
				{this.getRoutes()}
			</Locations>
		);
	},


	getRoutes () {
		var sections = this.getSectionNames();

		var routes = sections.map(section =>
			<Location
				key={section}
				path={`/${section}(/*)`}
				handler={Section}
				section={section}
			/>
		);

		if (this.state.defaultSection) {
			routes.push(<DefaultRoute
				key="default"
				handler={Redirect}
				location={`/${this.state.defaultSection}`}
			/>);
		}

		return routes;
	}

});
