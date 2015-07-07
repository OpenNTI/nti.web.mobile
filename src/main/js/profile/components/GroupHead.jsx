import React from 'react/addons';
import DisplayName from 'common/components/DisplayName';
import Ellipsed from 'common/components/Ellipsed';

export default React.createClass({
	displayName: 'Group:Head',

	propTypes: {
		children: React.PropTypes.any,

		entity: React.PropTypes.object
	},

	render () {
		let {children, entity} = this.props;

		return (
			<div className="profile-head">
				<div className="group">
					<div className="label">
						<DisplayName entity={entity} />
						<div className="subhead"><span className="icon" />Civil Rights and Civil Liberties P SC 4283-001</div>
					</div>

					<Ellipsed className="description">The purpose of this group is to start a respectful and reflective discussion on how social rights have progressed in modern day. In addition, this group is also a place to make a case on how social rights are still needing to improve in the 21st century.</Ellipsed>
				</div>
				{children}
			</div>
		);
	}
});
