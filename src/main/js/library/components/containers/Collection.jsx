import React from 'react';

import getItem from '../items';

const isEmpty = s => s == null || s === '';

export default React.createClass({
	displayName: 'Library:Collection',

	propTypes: {
		list: React.PropTypes.array,

		title: React.PropTypes.string,
		subtitle: React.PropTypes.string,

		children: React.PropTypes.any
	},

	render () {
		const {props: {children, list, title, subtitle}} = this;

		let titleRow = isEmpty(title) ? null : ( <h5>{title}<label>{subtitle}</label></h5> );

		return (
			<div className="library-collection">
				{titleRow}
				{children}
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
