import React from 'react';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';

import {DarkMode, Loading, Mixins} from 'nti-web-commons';

import Root from './Root';
import Section from './Section';
import SectionCommunities from './SectionCommunities';

import Library from '../mixins/LibraryAccessor';

export default React.createClass({
	displayName: 'Library:View',
	mixins: [Mixins.BasePath, Library],

	getInitialState () {
		return {};
	},

	render () {
		let {state: {loading} = {}} = this;

		return (
			<div>
				<DarkMode/>
				{loading ? (
					<Loading />
				) : (
					<Locations contextual>
						<Location path="/communities(/*)" handler={SectionCommunities} />
						<Location path="/:section(/*)" handler={Section} />

						<DefaultRoute handler={Root}/>
					</Locations>
				)}
			</div>
		);
	}
});
