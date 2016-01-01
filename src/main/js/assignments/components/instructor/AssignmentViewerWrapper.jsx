import React from 'react';
import {join} from 'path';

import {decodeFromURI} from 'nti-lib-interfaces/lib/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextMixin from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import ContentViewer from '../shared/AssignmentViewer';

import Header from './AssignmentViewStudentHeader';

export default React.createClass({
	displayName: 'AssignmentViewStudent',
	mixins: [BasePathAware, ContextMixin, NavigatableMixin],

	propTypes: {
		userId: React.PropTypes.string.isRequired,
		rootId: React.PropTypes.string.isRequired
	},


	getContext () {
		const {rootId, userId} = this.props;
		return {
			label: decodeURIComponent(userId),
			ntiid: decodeFromURI(rootId),
			href: this.makeHref(join(rootId, userId, '/'))
		};
	},


	render () {
		const {rootId, userId} = this.props;
		const assignmentId = decodeFromURI(rootId);
		const user = decodeURIComponent(userId);

		return (
			<div className="assignment-view-student">
				<Header {...this.props}
					userId={user}
					assignmentId={assignmentId}
					/>
				<ContentViewer {...this.props}
					userId={user}
					assignmentId={assignmentId}
					explicitContext={this}
					/>
			</div>
		);
	}
});
