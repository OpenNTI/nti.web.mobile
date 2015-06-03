import React from 'react';

import Communities from '../mixins/CommunityAccessor';

import Loading from './TinyLoader';

const isEmpty = x => !Array.isArray(x) || x.length === 0;

const difference = (a, b) => a.filter(x=> !b.includes(x));


export default React.createClass({
	displayName: 'SharedWithList',
	mixins: [Communities],

	propTypes: {
		item: React.PropTypes.object.isRequired,

		scope: React.PropTypes.shape({
			getPublicScope: React.PropTypes.func
		})
	},


	getInitialState () {
		return {};
	},


	isPublic (sharedWith) {
		if (isEmpty(sharedWith)) {
			return false;
		}

		let {scope} = this.props;
		let {communities} = this.state;

		let publicScope = (scope && scope.getPublicScope()) || [];

		if (!isEmpty(publicScope)) {
			return isEmpty(difference(publicScope, sharedWith));
		}

		//if communities is a subset of sharedWithIds we call it public
		return isEmpty(difference(communities.map(x => x && x.getID()), sharedWith));
	},


	render () {
		let {loading} = this.state;

		return loading ? (
			<Loading />
		) : (
			<span>List</span>
		);
	}
});
