import React from 'react';
import {decodeFromURI} from 'nti-lib-ntiids';

import {load as getLibrary} from 'library/Actions';
import CourseContentLink from 'library/mixins/CourseContentLink';
import Banner from 'common/components/Banner';
import Loading from 'common/components/Loading';
import ContextSender from 'common/mixins/ContextSender';
import {scoped} from 'common/locale';

import SendForm from './SendForm';

const t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'Invitations:Send',

	mixins: [ContextSender, CourseContentLink],

	propTypes: {
		courseId: React.PropTypes.string,
		course: React.PropTypes.object
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillMount () {
		this.setCourse();
	},

	setCourse ({courseId, course} = this.props) {
		if (course) {
			this.setState({
				course,
				loading: false
			});
		}
		else {
			getLibrary()
				.then(library => library.getCourse(decodeFromURI(courseId)))
				.then(c => this.setState({
					course: (c || {}).CourseInstance,
					loading: false
				}));
		}
	},


	getContext () {
		const path = this.courseHref(decodeFromURI(this.props.courseId), 'info');
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
