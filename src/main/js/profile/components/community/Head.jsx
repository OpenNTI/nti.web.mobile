import React from 'react';

import {Link} from 'react-router-component';

import cx from 'classnames';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

export default React.createClass({
	displayName: 'Community:Head',

	propTypes: {
		entity: React.PropTypes.object,

		narrow: React.PropTypes.object
	},

	render () {
		let {entity, narrow} = this.props;
		let role = 'admin';

		return (
			<div className="community head">
				<div className="coordinate-root">
					<div className="avatar-wrapper">
						<Avatar entity={entity}/>
					</div>
					{ narrow && (

						<div className="meta">
							<Link href="/info/" className="info-icon" />
							<DisplayName entity={entity} tag="h1"/>
							<ul>
								<li>Community</li>
								{role && ( <li className={cx('role', role)}>{role}</li> ) }
							</ul>
						</div>

					) }
				</div>
			</div>
		);
	}
});
