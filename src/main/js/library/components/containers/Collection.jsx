import PropTypes from 'prop-types';
import React from 'react';

import getItem from '../items';

const isEmpty = s => s == null || s === '';

export default class extends React.Component {
    static displayName = 'Library:Collection';

    static propTypes = {
		list: PropTypes.array,

		title: PropTypes.string,
		subtitle: PropTypes.string,

		children: PropTypes.any
	};

    render() {
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
}
