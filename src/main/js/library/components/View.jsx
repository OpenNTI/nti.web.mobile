import React from 'react';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';
import {getEnvironment} from 'react-router-component/lib/environment/LocalStorageKeyEnvironment';

import {addClass, removeClass} from 'common/utils/dom';

import Loading from 'common/components/Loading';
import Redirect from 'navigation/components/Redirect';

import Collection from './Collection';

import SectionMixin from '../mixins/SectionAware';


let Section = React.createClass({
	mixins: [SectionMixin],
	render () {
		let {section} = this.props;
		let bins = section ? this.getBinnedData(section) : [];
		let props = {
			className: 'library-view'
		};

		return React.createElement('div', props, ...bins.map(b=>
			<Collection title={b.name} subtitle={b.label} list={b.items}/>));
	}

});



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
			pickingDefault: true
		};
	},


	componentDidMount () {
		this.defaultSection().then(this.setDefaultSection);
		addClass(document.body, 'dark');
	},

	componentWillUnmount () {
		removeClass(document.body, 'dark');
	},


	setDefaultSection (name) {
		this.setState({
			pickingDefault: false,
			defaultSection: name
		});
	},


	render () {
		let {pickingDefault, loading} = this.state;
		if(loading || pickingDefault) {
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
