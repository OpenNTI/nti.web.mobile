import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {DateTime, Presentation} from '@nti/web-commons';
import {getService} from '@nti/web-client';
import {scoped} from '@nti/lib-locale';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

let CATALOG_CACHE = {};

const t = scoped('nti-web-mobile.notifications.components.kinds.Grade', {
	grade: 'grade'
});

async function resolveCatalogEntry (id) {
	const service = await getService();

	const request = CATALOG_CACHE[id] || service.getObject(id);

	if(!CATALOG_CACHE[id]) {
		CATALOG_CACHE[id] = request;

		setTimeout(() => {
			delete CATALOG_CACHE[id];
		}, 10000);
	}

	return request;
}

export default createReactClass({
	displayName: 'Grade',
	mixins: [NoteableMixin],

	statics: {
		noteableType: [
			'gradebook.grade',
			'grade'
		]
	},


	propTypes: {
		item: PropTypes.object
	},

	async componentDidMount () {
		const {item: {Item: {creator, CatalogEntryNTIID }}} = this.props;

		if(creator === 'system') {
			const catalogEntry = await resolveCatalogEntry(CatalogEntryNTIID);

			this.setState({
				catalogEntry
			});
		}
		else {
			this.setState({
				creator
			});
		}
	},

	render () {
		const {state: {url, catalogEntry, creator}, props: {item: {Item: {CourseName, AssignmentName = 'an assignment'}}}} = this;

		return (
			<li className="notification-item">
				<a href={url}>
					{creator && <Avatar entity={creator} width="32" height="32" suppressProfileLink/>}
					{catalogEntry && <Presentation.AssetBackground className="avatar" contentPackage={catalogEntry} type="thumb"/>}
					<div className="wrap">
						{creator && <DisplayName entity={creator} suppressProfileLink/>}
						{catalogEntry && <span>{catalogEntry.Title}</span>}
						<span> {t('grade')} {AssignmentName}{CourseName ? ` in ${CourseName}` : ''}</span>
						<DateTime date={this.getEventTime()} relative />
					</div>
				</a>
			</li>
		);
	}
});
