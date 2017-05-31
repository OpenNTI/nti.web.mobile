import React from 'react';
import createReactClass from 'create-react-class';
import {join} from 'path';

import {decodeFromURI} from 'nti-lib-ntiids';

import {Mixins} from 'nti-web-commons';
import ContextMixin from 'common/mixins/ContextContributor';

import ContentViewer from '../shared/AssignmentViewer';

import Header from './AssignmentViewStudentHeader';

export default createReactClass({
	displayName: 'AssignmentViewStudent',
	mixins: [Mixins.BasePath, ContextMixin, Mixins.NavigatableMixin],

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
