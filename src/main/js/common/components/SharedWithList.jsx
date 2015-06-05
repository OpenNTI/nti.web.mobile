import React from 'react';

import DisplayName from './DisplayName';

const isEmpty = x => !Array.isArray(x) || x.length === 0;

const difference = (a, b) => a.filter(x=> !b.includes(x));

const EVERYONE = 'everyone';

export default React.createClass({
	displayName: 'SharedWithList',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {};
	},


	isPublic (sharedWith) {
		if (isEmpty(sharedWith)) {
			return false;
		}

		return sharedWith.includes(EVERYONE);
	},


	render () {
		let {item} = this.props;
		let {sharedWith} = item;

		let state = this.isPublic(sharedWith) ? 'Public' : sharedWith.length ? 'Private' : 'Only Me';

		let names = [state].concat(sharedWith.filter(x => x !== EVERYONE).map(x => <DisplayName username={x}/>));

		return React.createElement('span', {className: 'shared-with-list'}, ...names);
	}
});
