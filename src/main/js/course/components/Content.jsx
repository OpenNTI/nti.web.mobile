import React from 'react';

import {decodeFromURI} from 'nti-lib-interfaces/lib/utils/ntiids';

import ContextContributor from 'common/mixins/ContextContributor';
import ContentViewer from 'content/components/Viewer';
import CourseLinker from 'library/mixins/CourseContentLink';

import {LESSONS} from '../Sections';

export default React.createClass({
	displayName: 'Content',
	mixins: [CourseLinker, ContextContributor],

	propTypes: {
		course: React.PropTypes.object.isRequired,

		outlineId: React.PropTypes.string.isRequired
	},

	getContext () {
		let {outlineId, course} = this.props;
		let id = decodeFromURI(outlineId);
		return course.getOutlineNode(id)
			.then(node=>({
				ntiid: id,
				label: node.label,
				// ref: node.ref,
				scope: node,//for UGD
				href: this.courseHref(course.getID(), LESSONS) + node.ref + '/'
			}),
			//error
			() => {
				console.warn('Could not find outline node: %s in course: ', id, course.getID());
			});
	},


	render () {
		return (
			<ContentViewer {...this.props} />
		);
	}
});
