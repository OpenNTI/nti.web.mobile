import React from 'react';

import {Link} from 'react-router-component';

import NavigationBar from 'navigation/components/Bar';

import {EmptyList, Mixins} from 'nti-web-commons';
import {getService} from 'nti-web-client';

import Collection from './containers/Collection';
import SectionTitle from './SectionTitle';
import AddButton from './AddButton';

export default React.createClass({
	displayName: 'SectionCommunities',

	mixins: [Mixins.ItemChanges],

	componentDidMount () {
		getService()
			.then(service => service.getCommunities())
			.then(store => this.setState({store})); //eslint-disable-line

	},


	getItem () {
		return (this.state || {}).store;
	},

	render () {

		let store = this.getItem();
		let items = store ? Array.from(store) : [];

		return (
			<div>
				<NavigationBar>
					<section position="left">
						<Link href="/" className="return-to">Back</Link>
					</section>
				</NavigationBar>

				<div className="library-page-title-area">
					<SectionTitle section="communities"/>
					<AddButton section="communities"/>
				</div>

				{items && items.length > 0
					? ( <div className="library-view single-section communities"><Collection list={items}/></div> )
					: ( <EmptyList type="library-communities"/> )}
			</div>
		);
	}

});
