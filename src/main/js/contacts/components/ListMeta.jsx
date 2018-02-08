import PropTypes from 'prop-types';
import React from 'react';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	members: {
		one: '%(count)s contact',
		other: '%(count)s contacts'
	}
};

const t = scoped('contacts.lists', DEFAULT_TEXT);

export default function ContactsListMeta ({entity}) {
	return (
		<div className="meta member-count">{t('members', {count: (entity.friends || []).length})}</div>
	);
}

ContactsListMeta.propTypes = {
	entity: PropTypes.object.isRequired
};
