import React, { Suspense } from 'react';

import { scoped } from '@nti/lib-locale';
import { HOC, Loading, useChanges } from '@nti/web-commons';
import { useService } from '@nti/web-core';
import {
	Avatar as AvatarBase,
	DisplayName as DisplayNameBase,
} from 'internal/common';

import ErrorBoundary from './ErrorBoundary';

const t = scoped('app.user-overlay.contact-list', {
	heading: 'Contacts',
	empty: 'No contacts found',
	allContacts: 'All Contacts',
	error: 'Unable to display contacts. An error occurred.',
});

//#region 🎨

const labeled = locale => props => ({
	'data-testid': locale,
	children: t(locale),
	...props,
});

const Empty = styled('div').attrs(labeled('empty'))`
	padding: 3rem 1rem;
	font-size: 0.875rem;
	text-align: center;
	color: var(--tertiary-grey);
	border-bottom: 1px solid var(--quad-grey);
	font-style: italic;
`;

const ViewAllContacts = styled('a').attrs(labeled('allContacts'))`
	display: block;
	text-align: center;
	font-size: 0.875rem;
	font-weight: 600;
	padding: 1em;
	border-bottom: 1px solid var(--quad-grey);
`;

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	font-size: 0.875rem;
`;

const ListItem = styled.li`
	margin: 0.75rem;
	display: flex;
	align-items: center;
`;

const Avatar = styled(AvatarBase)`
	width: 42px;
	height: 42px;
	margin-right: 0.75rem;
`;

const DisplayName = styled(DisplayNameBase)`
	max-width: 200px;
`;

//#endregion

function ContactsView({ basePath }) {
	return (
		<div>
			<h3>{t('heading')}</h3>
			<Suspense fallback={<Loading.Ellipsis />}>
				<ContactsList />
			</Suspense>
			<ViewAllContacts href={`${basePath}contacts`} />
		</div>
	);
}

function ContactsList() {
	const store = useService().getContacts();
	const { loading } = store;
	const contacts = Array.from(store).slice(0, 8);
	const empty = contacts.length === 0;

	useChanges(store);

	return loading ? (
		<Loading.Ellipsis />
	) : empty ? (
		<Empty />
	) : (
		<List>
			{contacts.map(c => (
				<ListItem key={c.getID()}>
					<Avatar entity={c} />
					<DisplayName entity={c} />
				</ListItem>
			))}
		</List>
	);
}

export default ErrorBoundary(e => (
	<Empty data-testid="error">{t('error')}</Empty>
))(HOC.BasePath.connect(ContactsView));
