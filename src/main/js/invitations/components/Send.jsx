import React from 'react';

import CourseContentLink from 'library/mixins/CourseContentLink';
import {Banner, Loading} from 'nti-web-commons';
import ContextSender from 'common/mixins/ContextSender';
import {scoped} from 'nti-lib-locale';

import SendForm from './SendForm';

const t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'Invitations:Send',

	mixins: [ContextSender, CourseContentLink],

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillMount () {
		this.setCourse();
	},

	setCourse ({course} = this.props) {
		if (course) {
			this.setState({
				course,
				loading: false
			});
		}
	},

	getContext () {
		const {course} = this.props;
		const path = this.courseHref(course.getID(), 'info');
		return Promise.resolve([
			{
				href: path, label: 'Course Info'
			}, {
				label: t('title')
			}
		]);
	},

	render () {

		const {loading, course} = this.state;

		if(loading) {
			return <Loading />;
		}

		return (
			<div className="invitation-send">
				<Banner item={course} />
				<SendForm course={course} />
			</div>
		);

	}
});
