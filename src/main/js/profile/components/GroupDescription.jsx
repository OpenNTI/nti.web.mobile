import React from 'react';
import Ellipsed from 'common/components/Ellipsed';

export default React.createClass({
	displayName: 'GroupDescription',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;

		if (!entity || !entity.description) {
			return null;
		}

		return (
			<Ellipsed className="description">The purpose of this group is to start a respectful and reflective discussion on how social rights have progressed in modern day. In addition, this group is also a place to make a case on how social rights are still needing to improve in the 21st century.</Ellipsed>
		);
	}
});
