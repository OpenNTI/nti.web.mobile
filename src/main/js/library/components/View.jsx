import React from 'react';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';

import DarkMode from 'common/components/DarkMode';
import Loading from 'common/components/Loading';

import Root from './Root';
import Section from './Section';

import SectionMixin from '../mixins/SectionAware';
import BasePath from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'Library:View',
	mixins: [BasePath, SectionMixin],

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
						<Location path="/:section(/*)" handler={Section} />

						<DefaultRoute handler={Root}/>
					</Locations>
				)}
			</div>
		);
	}
});
