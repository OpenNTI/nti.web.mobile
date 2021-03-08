import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Mixins } from '@nti/web-commons';
import ContextSender from 'internal/common/mixins/ContextSender';

import ListDetail from './ListDetail';
import DistributionLists from './DistributionLists';

export default createReactClass({
	displayName: 'Contacts:ListsView',
	mixins: [ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		id: PropTypes.string,
	},

	getContext() {
		return Promise.resolve({
			href: this.makeHref('/lists/'),
			label: 'Distribution Lists',
		});
	},

	render() {
		let { id } = this.props;
		return id ? (
			<ListDetail id={id} {...this.props} />
		) : (
			<DistributionLists {...this.props} />
		);
	},
});
