import React from 'react';
import createReactClass from 'create-react-class';
import {join} from 'path';

import {decodeFromURI} from 'nti-lib-ntiids';

import ContextMixin from 'common/mixins/ContextContributor';
import {Mixins} from 'nti-web-commons';

import AssignmentViewer from './AssignmentViewerWrapper';

export default createReactClass({
	displayName: 'AssignmentViewForStudent',
	mixins: [ContextMixin, Mixins.NavigatableMixin],

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
