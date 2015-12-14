import React from 'react';
import cx from 'classnames';

import {BLANK_IMAGE} from '../constants/DataURIs';
import ItemChanges from '../mixins/ItemChanges';

export default React.createClass({
	displayName: 'Content:Banner',
	mixins: [ItemChanges],

	propTypes: {
		children: React.PropTypes.node,
		className: React.PropTypes.string,

		/**
		 * @type {object} Any model that implements getPresentationProperties()
		 */
		item: React.PropTypes.shape({
			getPresentationProperties: React.PropTypes.func }).isRequired,

		preferBackground: React.PropTypes.bool
	},

	render () {
		const {children, className, item, preferBackground} = this.props;
		if (!item) {
			console.warn('contentPackage prop is required. skipping render.');
			return null;
		}
		const p = item.getPresentationProperties();

		const icon = preferBackground ? (p.background || p.icon) : p.icon;

		return (
			<div className={cx('content-banner', className)}>
				<img src={icon || BLANK_IMAGE} />
				<label>
					<h3>{p.title}</h3>
					<h5>{p.label}</h5>
				</label>
				{children}
			</div>
		);
	}
});
