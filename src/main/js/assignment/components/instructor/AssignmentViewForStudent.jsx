import {join} from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {decodeFromURI} from 'nti-lib-ntiids';
import {Mixins} from 'nti-web-commons';

import ContextMixin from 'common/mixins/ContextContributor';

import AssignmentViewer from './AssignmentViewerWrapper';

export default createReactClass({
	displayName: 'AssignmentViewForStudent',
	mixins: [ContextMixin, Mixins.NavigatableMixin],

	propTypes: {
		rootId: PropTypes.string
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
