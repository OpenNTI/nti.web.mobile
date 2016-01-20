import React from 'react';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';

import DarkMode from 'common/components/DarkMode';
import Loading from 'common/components/Loading';

import Root from './Root';
import Section from './Section';
import SectionCommunities from './SectionCommunities';

import Library from '../mixins/LibraryAccessor';
import BasePath from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Library:View',
	mixins: [BasePath, Library],

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
