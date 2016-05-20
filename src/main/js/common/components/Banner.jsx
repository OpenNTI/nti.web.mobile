import React from 'react';
import cx from 'classnames';
import {Constants} from 'nti-web-commons';
import {Mixins} from 'nti-web-commons';

const {DataURIs: {BLANK_IMAGE}} = Constants;

export default React.createClass({
	displayName: 'Content:Banner',
	mixins: [Mixins.ItemChanges],

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
