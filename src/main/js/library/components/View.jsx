import React from 'react';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';
import {getEnvironment} from 'react-router-component/lib/environment/LocalStorageKeyEnvironment';

import addClass from 'nti.lib.dom/lib/addclass';
import removeClass from 'nti.lib.dom/lib/removeclass';

import ActiveState from 'common/components/ActiveState';
import Loading from 'common/components/Loading';
import Redirect from 'navigation/components/Redirect';

import {scoped} from 'common/locale';

import NavigationBar from 'navigation/components/Bar';

import Collection from './Collection';

import SectionMixin from '../mixins/SectionAware';
import BasePath from 'common/mixins/BasePath';
import SetStateSafely from 'common/mixins/SetStateSafely';

let getTitle = scoped('LIBRARY.SECTIONS');

let sectionProps = x=> {
	let title = getTitle(x.label);
	return Object.assign({children: title, title, href: `/${x.key}`}, x);
};

let Section = React.createClass({
	mixins: [BasePath, SectionMixin],

	componentWillMount () {
		let availableSections = this.getAvailableSections();
		this.setState({availableSections});
	},

	render () {
		let {section} = this.props;
		let bins = section ? this.getBinnedData(section) : [];

		let props = {
			className: 'library-view'
		};

		let {availableSections} = this.state;


		if (!availableSections || !availableSections.length) {
			availableSections = null;
		}

		return (
			<div>
				<NavigationBar title="Library">
					<a href={this.getBasePath() + 'catalog/'} position="left" className="add">Add</a>
					{availableSections &&
						React.createElement('ul', {className: 'title-tabs', position: 'center'},
							...availableSections.map(x=>
								<li><ActiveState tag="a" {...sectionProps(x)}/></li>
							))}
				</NavigationBar>
				{React.createElement('div', props, ...bins.map(b=>
					<Collection title={b.name} subtitle={b.label} list={b.items}/>))}
			</div>
		);
	}

});



export default React.createClass({
	displayName: 'Library:View',
	mixins: [BasePath, SetStateSafely, SectionMixin],

	getInitialState () {
		let env = getEnvironment('library');

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
		let {env} = this.state;
		let p = env.getPath();

		if (p == null || p === '') {
			env.setPath('/${name}');
		}

		this.setStateSafely({
			pickingDefault: false,
			defaultSection: name
		});
	},


	render () {
		let {env} = this.state;
		let {pickingDefault, loading} = this.state;

		loading = loading || pickingDefault;

		return loading ?
			<Loading /> :
			<Locations environment={env}>
				{this.getRoutes()}
			</Locations>
			;
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
