import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Logger from 'nti-util-logger';
import {decodeFromURI} from 'nti-lib-ntiids';

import ContextContributor from 'common/mixins/ContextContributor';
import ContentViewer from 'content/components/Viewer';
import CourseLinker from 'library/mixins/CourseContentLink';

import {LESSONS} from '../Sections';

const logger = Logger.get('course:content');

export default createReactClass({
	displayName: 'Content',
	mixins: [CourseLinker, ContextContributor],

	propTypes: {
		course: PropTypes.object.isRequired,

		outlineId: PropTypes.string.isRequired
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
				logger.warn('Could not find outline node: %s in course: ', id, course.getID());
			});
	},


	render () {
		return (
			<ContentViewer {...this.props} />
		);
	}
});
