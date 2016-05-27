import React from 'react';
import {join} from 'path';

import ContextMixin from 'common/mixins/ContextContributor';
import {Mixins} from 'nti-web-commons';

import AssignmentViewer from '../AssignmentViewerWrapper';

export default React.createClass({
	displayName: 'AssignmentViewForStudent(Performance)',
	mixins: [ContextMixin, Mixins.NavigatableMixin],

	propTypes: {
		userId: React.PropTypes.string
	},

	getContext () {
		const {userId} = this.props;
		return {
			label: 'Assignments',
			href: this.makeHref(join('performance', userId, '/') )
		};
	},

	render () {
		return (
			<AssignmentViewer {...this.props} />
		);
	}
});
