import React from 'react/addons';

import ActiveState from 'common/components/ActiveState';
import BasePathAware from 'common/mixins/BasePath';

import RouteMap from '../../routes';


export default React.createClass({
	displayName: 'navigation:View',
	mixins: [BasePathAware],

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

			</div>
		);
	}
});
