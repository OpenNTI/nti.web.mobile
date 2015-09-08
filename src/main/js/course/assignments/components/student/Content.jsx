import React from 'react';

// import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';

import ContentViewer from 'content/components/Viewer';

export default React.createClass({
	displayName: 'Content',
	mixins: [BasePathAware, ContextContributor],

	propTypes: {
		course: React.PropTypes.object.isRequired,

		outlineId: React.PropTypes.string.isRequired
	},

	// getContext () {
	// 	let {outlineId, course} = this.props;
	// 	let id = decodeFromURI(outlineId);
	// 	return course.getOutlineNode(id).then(node=>({
	// 		ntiid: node.getID(),
	// 		label: node.label,
	// 		// ref: node.ref,
	// 		scope: node,//for UGD
	// 		href: this.getBasePath() + node.href
	// 	}));
	// },


	render () {
		return (
			<ContentViewer {...this.props} />
		);
	}
});
