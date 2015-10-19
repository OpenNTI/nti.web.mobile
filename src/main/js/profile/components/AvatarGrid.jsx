import React from 'react';
import AvatarProfileLink from './AvatarProfileLink';

export default React.createClass({
	displayName: 'AvatarGrid',

	propTypes: {
		entities: React.PropTypes.shape({
			map: React.PropTypes.func }).isRequired,

		classesFor: React.PropTypes.func
	},

	render () {
		let {entities, classesFor} = this.props;

		return (
			<ul className="avatar-grid">
				{(entities || []).map((e, i) => {
					let css = classesFor ? classesFor(e) : null;
					return (
						<li key={'avatar' + i} className={css}>
							<AvatarProfileLink entity={e} />
						</li>
					);
				})}
			</ul>
		);
	}
});
