import React from 'react';
import {scoped} from 'common/locale';

let t = scoped('CONTACTS');

export default function ContactsListMeta ({entity}) {
	return (
		<div className="meta member-count">{t('listMembers', {count: (entity.friends || []).length})}</div>
	);
}

ContactsListMeta.propTypes = {
	entity: React.PropTypes.object.isRequired
};
