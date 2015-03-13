import React from 'react';

import {decodeFromURI} from 'dataserverinterface/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';

import ContentViewer from 'content/components/Viewer';

export default React.createClass({
	displayName: 'Content',
	mixins: [BasePathAware, ContextContributor],

	getContext () {
		let {outlineId, course} = this.props;
		let id = decodeFromURI(outlineId);
		return course.getOutlineNode(id).then(node=>({
			ntiid: node.getID(),
			label: node.label,
			// ref: node.ref,
			href: this.getBasePath() + node.href
		}));
	},


	render () {
		return (
			<ContentViewer slug="c" {...this.props} />
		);
	}
});
