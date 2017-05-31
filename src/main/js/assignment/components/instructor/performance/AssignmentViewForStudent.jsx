import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {join} from 'path';

import ContextMixin from 'common/mixins/ContextContributor';
import {Mixins} from 'nti-web-commons';

import AssignmentViewer from '../AssignmentViewerWrapper';

export default createReactClass({
	displayName: 'AssignmentViewForStudent(Performance)',
	mixins: [ContextMixin, Mixins.NavigatableMixin],

	propTypes: {
		userId: PropTypes.string
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
