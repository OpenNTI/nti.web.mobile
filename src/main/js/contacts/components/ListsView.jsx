import React from 'react';
import ListDetail from './ListDetail';
import DistributionLists from './DistributionLists';
import ContextSender from 'common/mixins/ContextSender';
import {Mixins} from 'nti-web-commons';

export default React.createClass({
	displayName: 'Contacts:ListsView',
	mixins: [ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		id: React.PropTypes.string
	},

	getContext () {
		return Promise.resolve({
			href: this.makeHref('/lists/'),
			label: 'Distribution Lists'
		});
	},

	render () {
		let {id} = this.props;
		return id ? <ListDetail id={id} {...this.props} /> : <DistributionLists {...this.props} />;
	}
});
