import React from 'react';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import BasePathAware from 'common/mixins/BasePath';
import {join} from 'path';
import {encode} from 'common/utils/user';

export default React.createClass({
	displayName: 'AvatarGrid',

	propTypes: {
		entities: React.PropTypes.array.isRequired
	},

	mixins: [BasePathAware],

	render () {

		let {entities} = this.props;

		let base = this.getBasePath();

		return (
			<ul className="avatar-grid">
				{(entities || []).map((e, i) => {
					let profile = join(base, 'profile', encode(e.Username));
					return (<li key={'avatar' + i}>
								<a href={profile}><Avatar entity={e} /></a>
								<div className="body">
									<DisplayName entity={e} />
									<span className="location">{e.location}</span>
								</div>
							</li>);
				})}
			</ul>
		);
	}
});
