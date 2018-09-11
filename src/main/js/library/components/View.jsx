import React from 'react';
import createReactClass from 'create-react-class';
import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';
import {DarkMode, Loading, Mixins} from '@nti/web-commons';
import {isFlag} from '@nti/web-client';

import Library from '../mixins/LibraryAccessor';

import NewLibrary from './Home';
import Root from './Root';
import Section from './Section';
import SectionCommunities from './SectionCommunities';



const OldLibrary = createReactClass({
	displayName: 'LibraryView',
	mixins: [Mixins.BasePath, Library],

	getInitialState () {
		return {};
	},

	renderLocations () {
		return (
			<Locations contextual>
				<Location path="/communities(/*)" handler={SectionCommunities} />
				<Location path="/:section(/*)" handler={Section} />

				<DefaultRoute handler={Root}/>
			</Locations>
		);
	},

	render () {
		let {state: {loading} = {}} = this;

		return loading ? (
			<Loading.Mask />
		) : (
			this.renderLocations()
		);
	}
});


export default function View () {

	return (
		<>
			<DarkMode/>
			{isFlag('library-searchable') ? (
				<NewLibrary/>
			) : (
				<OldLibrary/>
			)}
		</>
	);
}
