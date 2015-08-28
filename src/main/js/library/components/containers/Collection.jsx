import React from 'react';

import getItem from '../items';

export default React.createClass({
	displayName: 'Library:Collection',

	propTypes: {
		omittitle: React.PropTypes.bool,
		list: React.PropTypes.array,
		title: React.PropTypes.string,
		subtitle: React.PropTypes.string
	},

	render () {
		const {props: {omittitle, list, title, subtitle}} = this;

		return (
			<div className="library-collection">
				{omittitle ? null :
					<h5>{title}<label>{subtitle}</label></h5>}

				<ul>
				{list.map(item => {
					let Item = getItem(item);
					return Item && (
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
