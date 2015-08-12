import React from 'react';
import {scoped} from 'common/locale';

let t = scoped('CONTACTS');

export default React.createClass({
	displayName: 'Contacts:ListMeta',
	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {
		let {entity} = this.props;
		return (
			<div className="meta member-count">{t('listMembers', {count: (entity.friends || []).length})}</div>
		);
	}
});
