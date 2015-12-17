import React from 'react';
import {join} from 'path';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import ContentViewer from '../shared/AssignmentViewer';

import Header from './AssignmentViewStudentHeader';

export default React.createClass({
	displayName: 'AssignmentViewStudent',
	mixins: [BasePathAware, ContextSender, NavigatableMixin],

	propTypes: {
		course: React.PropTypes.object.isRequired,
		userId: React.PropTypes.string.isRequired,
		rootId: React.PropTypes.string.isRequired
	},


	getContext () {
		const {rootId, userId} = this.props;
		return [
			{
				label: 'Assignment',
				ntiid: decodeFromURI(rootId),
				href: this.makeHref(join(rootId, '/students/'))
			},
			{
				label: decodeURIComponent(userId),
				ntiid: decodeFromURI(rootId),
				href: this.makeHref(join(rootId, userId, '/'))
			}
		];
	},


	render () {
		return (
			<div className="assignment-view-student">
				<Header {...this.props} />
				<ContentViewer {...this.props} explicitContext={this}/>
			</div>
		);
	}
});
