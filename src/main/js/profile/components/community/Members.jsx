import React from 'react';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import ProfileLink from '../ProfileLink';

export default React.createClass({
	displayName: 'Community:Members',
	mixins: [BasePathAware, ContextSender],

	propTypes: {
		entity: React.PropTypes.object,

		nested: React.PropTypes.bool
	},

	getContext () {
		let {entity, nested} = this.props;
		let base = this.getBasePath() + ProfileLink.makeHref(entity);

		return Promise.resolve([
			{
				label: 'Members',
				href: base + (nested ? 'info/' : '') + 'members/'
			}
		]);
	},

	render () {
		//render normal list here... without sidebar/column
		return (
			<div />
		);
	}
});
