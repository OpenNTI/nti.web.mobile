import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import ContentViewer from 'content/components/Viewer';

import Header from './AssignmentViewStudentHeader';

export default React.createClass({
	displayName: 'AssignmentViewStudent',
	mixins: [BasePathAware, ContextContributor, NavigatableMixin],

	propTypes: {
		course: React.PropTypes.object.isRequired,
		userId: React.PropTypes.string.isRequired,
		rootId: React.PropTypes.string.isRequired
	},


	getContext () {
		const {rootId} = this.props;
		return Promise.resolve({
			label: 'Assignment',
			ntiid: decodeFromURI(rootId),
			href: this.makeHref(rootId)
		});
	},


	render () {
		return (
			<div className="assignment-view-student">
				<Header userId={this.props.userId} />
				<ContentViewer {...this.props} explicitContext={this}/>
			</div>
		);
	}
});
