import React from 'react';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

export default React.createClass({
	displayName: 'AvatarGrid',

	propTypes: {
		entities: React.PropTypes.array.isRequired
	},

	render () {

		let {entities} = this.props;

		return (
			<ul className="avatar-grid">
				{(entities || []).map((e, i) =>
					<li key={'avatar' + i}>
						<Avatar entity={e} />
						<div className="body">
							<DisplayName entity={e} />
							<span className="location">{e.location}</span>
						</div>
					</li>
				)}
			</ul>
		);
	}
});
