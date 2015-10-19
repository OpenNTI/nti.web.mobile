import React from 'react';
import ListDetail from './ListDetail';
import DistributionLists from './DistributionLists';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

export default React.createClass({
	displayName: 'Contacts:ListsView',
	mixins: [ContextSender, NavigatableMixin],

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
