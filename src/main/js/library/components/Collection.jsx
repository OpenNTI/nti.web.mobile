import React from 'react';

import Package from './Package';
import Bundle from './Bundle';
import Course from './Course';


export default React.createClass({
	displayName: 'Library:Collection',
	render () {
		let {omittitle, list, title, subtitle} = this.props;
		return (
			<div className="library-collection">
				{omittitle ? null :
					<h5>{title}<label>{subtitle}</label></h5>}

				<ul>
				{list.map(item => {
					var Item = item.isBundle ?
							Bundle :
							item.isCourse ?
								Course :
								Package;

					return (
						<li key={item.NTIID || item.href}>
							<Item item={item}/>
						</li>
					);
				})}
				</ul>
			</div>
		);
	}
});
