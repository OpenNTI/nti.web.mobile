import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {HOC, Loading} from '@nti/web-commons';

import {Avatar, DisplayName} from 'common';

import ErrorBoundary from '../ErrorBoundary';

import {default as Store, CONTACTS, LOADING} from './Store';

const t = scoped('app.user-overlay.contact-list', {
	heading: 'Contacts',
	allContacts: 'All Contacts',
	error: 'Unable to display contacts. An error occurred.'
});

const getErrorMessage = e => <div className="contacts-display-error">{t('error')}</div>;

export default
@HOC.BasePath.connect
@ErrorBoundary(getErrorMessage)
@Store.connect({
	store: 'store',
	[LOADING]: 'loading',
	[CONTACTS]: 'contacts'
})
class ContactsView extends React.Component {
	static propTypes = {
		store: PropTypes.object,
		loading: PropTypes.bool,
		contacts: PropTypes.array,
		basePath: PropTypes.string
	}

	componentDidMount () {
		const {store} = this.props;
		store.load();
	}

	renderEmpty () {

	}

	renderContacts () {
		const {contacts} = this.props;

		return !(contacts || []).length ? null : (
			<ul className="contacts-list">
				{contacts
					.slice(0, 8)
					.map(c => (
						<li key={c.getID()}>
							<Avatar entity={c} />
							<DisplayName entity={c} />
						</li>
					))
				}
			</ul>
		);
	}

	render () {
		const {loading, contacts, basePath} = this.props;
		const empty = !contacts || !contacts.length;

		return (
			<div className="contacts-list-wrapper">
				<h3>{t('heading')}</h3>
				{
					loading
						? <Loading.Ellipsis />
						: empty
							? this.renderEmpty()
							: this.renderContacts()
				}
				<a className="all-contacts-link" href={`${basePath}contacts`}>{t('allContacts')}</a>
			</div>
		);
	}
}
