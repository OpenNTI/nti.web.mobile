import React from 'react';
import {join} from 'path';

import {decodeFromURI} from 'nti.lib.interfaces/lib/utils/ntiids';

import ContextMixin from 'common/mixins/ContextContributor';
import Navigatable from 'common/mixins/NavigatableMixin';

import AssignmentViewer from './AssignmentViewerWrapper';

export default React.createClass({
	displayName: 'AssignmentViewForStudent',
	mixins: [ContextMixin, Navigatable],

	propTypes: {
		rootId: React.PropTypes.string
	},

	getContext () {
		const {rootId} = this.props;
		return {
			label: 'Students',
			ntiid: decodeFromURI(rootId),
			href: this.makeHref(join(rootId, '/students/'))
		};
	},

	render () {
		return (
			<AssignmentViewer {...this.props} />
		);
	}
});
