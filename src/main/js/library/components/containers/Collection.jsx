import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import getItem from '../items';

const isEmpty = s => s == null || s === '';

export default class LibraryCollection extends React.Component {

	static propTypes = {
		className: PropTypes.string,
		list: PropTypes.array,

		title: PropTypes.string,
		subtitle: PropTypes.string,

		children: PropTypes.any
	}

	render () {
		const {props: {children, className, list, title, subtitle}} = this;

		let titleRow = isEmpty(title) ? null : ( <h5>{title}<label>{subtitle}</label></h5> );

		return (
			<div className={cx('library-collection-old', className)}>
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
