import React from 'react';

import Collection from './Collection';
import CatalogEntryDetail from './CatalogEntryDetail';

import CatalogAccessor from '../mixins/CatalogAccessor';

import NavigationBar from 'navigation/components/Bar';

import BasePathAware from 'common/mixins/BasePath';

import Loading from 'common/components/Loading';

import {Locations, Location} from 'react-router-component';

import Enrollment from 'enrollment/components/View';

export default React.createClass({
	displayName: 'CatalogView',
	mixins: [CatalogAccessor, BasePathAware],


	shouldComponentUpdate (_, newState) {
		var newCatalog = (this.state || {}).catalog !== (newState || {}).catalog;

		var {router} = this.refs;
		var r = router || {refs: {}};
		var {enrollment} = r.refs;

		if (newCatalog && enrollment && enrollment.isMounted()) {
			return false;
		}

		return true;
	},


	render () {
        var catalog = this.getCatalog();

        // console.log('CatalogView.props: %O',this.props);


        return (
			<div>
				<NavigationBar title="Catalog" contextProvider={this.getContext}/>
				{!catalog ?
					<Loading/> :
					<Locations contextual={true} ref="router">
						<Location
							ref="enrollment"
							path="/item/:entryId/enrollment(/*)"
							handler={Enrollment}
						/>
			            <Location
			                path="/item/:entryId(/*)"
			                handler={CatalogEntryDetail}
			            />
			            <Location
			                path="*"
			                handler={Collection}
			                list={catalog}
			                section="catalog"
			            />
				</Locations>
			}
			</div>
        );
	},


	getContext () {
		return Promise.resolve([{
			label: 'Library',
			href: this.getBasePath() + 'library/'
		}]);
	}
});
