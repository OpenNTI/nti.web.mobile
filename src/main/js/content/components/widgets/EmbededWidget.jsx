import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import {Widgets} from '@nti/web-content';
import {getViewportWidth} from '@nti/lib-dom';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'embeded-widget',
	mixins: [Mixin],

	statics: {
		itemType: /embeded\.widget/i,
		interactiveInContext: false
	},


	propTypes: {
		item: PropTypes.object,
		contentPackage: PropTypes.object
	},


	render () {
		const {item, contentPackage} = this.props;

		return (
			<Widgets.EmbeddedWidget
				item={item}
				contentPackage={contentPackage}
				maxWidth={getViewportWidth()}
			/>
		);
	}
});
