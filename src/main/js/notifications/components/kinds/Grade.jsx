import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {DateTime, Presentation} from '@nti/web-commons';
import {getService} from '@nti/web-client';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import NoteableMixin from '../mixins/Noteable';

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

	componentDidMount () {
		const {item: {Item: {creator, CatalogEntryNTIID }}} = this.props;

		if(creator === 'system') {
			getService().then(service => {
				service.getObject(CatalogEntryNTIID).then(catalogEntry => {
					this.setState({
						catalogEntry
					});
				});
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
						<span> graded {AssignmentName}{CourseName ? ` in ${CourseName}` : ''}</span>
						<DateTime date={this.getEventTime()} relative />
					</div>
				</a>
			</li>
		);
	}
});
