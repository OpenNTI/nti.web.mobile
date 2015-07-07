import React from 'react';
import Avatar from 'common/components/Avatar';

export default React.createClass({
	displayName: 'AvatarGrid',

	propTypes: {
		entities: React.PropTypes.array.isRequired
	},

	render () {

		let {entities} = this.props;

		return (
			<ul className="avatar-grid">
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				{(entities || []).map(e => <li><Avatar user={e} /></li>)}
				
			</ul>
		);
	}
});
