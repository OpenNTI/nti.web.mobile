import React from 'react';

import Package from './Package';
import Bundle from './Bundle';
import Course from './Course';


export default React.createClass({
	displayName: 'Library:Collection',
	render () {
		return (
			<div className="library-collection">
				{this.props.omittitle ? null : <h5>{this.props.title}</h5>}
				<ul>
				{this.props.list.map(item => {
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
