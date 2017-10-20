import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {TableOfContents} from 'nti-content';
import {Mixins} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';


// const TYPE_TAG_MAP = {
// 	part: 'h1',
// 	chapter: 'h3'
// };

export default createReactClass({
	displayName: 'TableOfContentsView',
	mixins: [
		Mixins.BasePath,
		ContextSender,
		Mixins.NavigatableMixin
	],

	propTypes: {
		contentPackage: PropTypes.object.isRequired,
		item: PropTypes.object
	},


	render () {
		const {contentPackage} = this.props;

		return (
			<TableOfContents.View contentPackage={contentPackage} banner />
		);
	}
});
