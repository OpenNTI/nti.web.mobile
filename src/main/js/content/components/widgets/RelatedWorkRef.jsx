import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {AssetIcon} from 'nti-web-commons';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'RelatedWorkRef',

	mixins: [Mixin],

	statics: {
		itemType: /relatedworkref/i
	},

	propTypes: {
		item: PropTypes.object
	},

	render () {

		const {item} = this.props;
		const {label, byline, description} = item;
		const mimeType = (item.ContentFile || {}).FileMimeType;

		return (
			<div className="related-work-ref">
				<AssetIcon mimeType={mimeType} />
				<div className="meta">
					<div className="title">{label}</div>
					{byline && <div className="byline">by {byline}</div>}
					<div className="description">{description}</div>
				</div>
			</div>
		);
	}
});
