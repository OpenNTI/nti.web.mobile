import React from 'react/addons';

import ActiveState from 'common/components/ActiveState';
import Loading from 'common/components/LoadingInline';
import BasePathAware from 'common/mixins/BasePath';
import StoreEventAware from 'common/mixins/StoreEvents';
import SetStateSafely from 'common/mixins/SetStateSafely';

import RouteMap from '../../routes';

import Store from '../Store';

import {navigationComponentFor} from './types';

export default React.createClass({
	displayName: 'navigation:View',
	mixins: [BasePathAware, StoreEventAware, SetStateSafely],

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},


	synchronizeFromStore () {
		this.forceUpdate();
	},


	render () {
		let base = this.getBasePath();

		let NavPoints = RouteMap.filter(x=>x.navIndex!=null).map(x=>Object.assign({}, x, {
			href: base + x.path.replace(/\*$/,''),
			className: x.handler.toLowerCase(),
			title: x.handler
		}));

		NavPoints.sort((a,b)=>a.navIndex-b.navIndex);

		return (
			<div className="nav">
				<ul className="main">
					{NavPoints.map(x=>
						<li key={x.path}><ActiveState tag="a" hasChildren {...x}>{x.title}</ActiveState></li>
					)}
				</ul>


				{Store.isLoading ? <Loading/> : this.renderActiveContentNav()}
			</div>
		);
	},


	renderActiveContentNav () {
		let data = Store.getData();
 		let Component = navigationComponentFor(data);

		let item = data && data.item;

		return Component && (
			<Component item={item}/>
		);
	}

});
