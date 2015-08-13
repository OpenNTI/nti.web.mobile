import React from 'react';
import ListDetail from './ListDetail';
import DistributionLists from './DistributionLists';

export default React.createClass({
	displayName: 'Contacts:ListsView',

	propTypes: {
		id: React.PropTypes.string
	},

	render () {
		let {id} = this.props;
		return id ? <ListDetail id={id} {...this.props} /> : <DistributionLists {...this.props} />;
	}
});
