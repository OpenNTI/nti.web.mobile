import React from 'react';
import {BLANK_IMAGE} from 'common/constants/DataURIs';

export default React.createClass({
	displayName: 'Content:Banner',

	propTypes: {
		/**
		 * @type {object} Any model that implements getPresentationProperties()
		 */
		contentPackage: React.PropTypes.shape({
			getPresentationProperties: React.PropTypes.func }).isRequired,

		preferBackground: React.PropTypes.bool
	},

	render () {
		const {contentPackage, preferBackground} = this.props;
		if (!contentPackage) {
			console.warn('contentPackage prop is required. skipping render.');
			return null;
		}
		const p = contentPackage.getPresentationProperties();

		const icon = preferBackground ? (p.background || p.icon) : p.icon;

		return (
			<div className="content-banner">
				<img src={icon || BLANK_IMAGE} />
				<label>
					<h3>{p.title}</h3>
					<h5>{p.label}</h5>
				</label>
			</div>
		);
	}
});
