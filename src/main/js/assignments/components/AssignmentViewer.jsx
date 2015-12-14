import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import ContentViewer from 'content/components/Viewer';

export default React.createClass({
	displayName: 'AssignmentViewer',
	mixins: [BasePathAware, ContextContributor, NavigatableMixin],

	propTypes: {
		course: React.PropTypes.object.isRequired,

		rootId: React.PropTypes.string.isRequired
	},


	getContext () {
		const {rootId} = this.props;
		return Promise.resolve({
			label: 'Assignment',//This is good enough
			ntiid: decodeFromURI(rootId),
			href: this.makeHref(rootId)
		});
	},


	render () {
		return (
			<ContentViewer {...this.props} explicitContext={this}/>
		);
	}
});
