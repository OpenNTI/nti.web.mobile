import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {DateTime} from '@nti/web-commons';

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


	render () {
		const {state: {url}, props: {item: {Item: {creator, CourseName, AssignmentName = 'an assignment'}}}} = this;

		return (
			<li className="notification-item">
				<a href={url}>
					<Avatar entity={creator} width="32" height="32" suppressProfileLink/>
					<div className="wrap">
						<DisplayName entity={creator} suppressProfileLink/> graded {AssignmentName}{CourseName ? ` in ${CourseName}` : ''}
						<DateTime date={this.getEventTime()} relative />
					</div>
				</a>
			</li>
		);
	}
});
