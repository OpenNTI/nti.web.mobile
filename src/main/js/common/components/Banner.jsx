import React from 'react';
import {BLANK_IMAGE} from 'common/constants/DataURIs';

export default React.createClass({
	displayName: 'Content:Banner',

	propTypes: {
		/**
		 * @type {object} Any model that implements getPresentationProperties()
		 */
		contentPackage: React.PropTypes.shape({
			getPresentationProperties: React.PropTypes.func }).isRequired
	},

	render () {
		let {contentPackage} = this.props;
		if (!contentPackage) {
			console.warn('contentPackage prop is required. skipping render.');
			return null;
		}
		let p = contentPackage.getPresentationProperties();
		return (
			<div className="content-banner">
				<img src={p.background || p.icon || BLANK_IMAGE} />
				<label>
					<h3>{p.title}</h3>
					<h5>{p.label}</h5>
				</label>
			</div>
		);
	}
});
