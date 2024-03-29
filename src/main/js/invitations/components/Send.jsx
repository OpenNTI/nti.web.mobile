import './Send.scss';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Banner, Loading } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import CourseContentLink from 'internal/library/mixins/CourseContentLink';
import ContextSender from 'internal/common/mixins/ContextSender';

import SendForm from './SendForm';

const t = scoped('invitations.view', {
	title: 'Invitation',
});

export default createReactClass({
	displayName: 'Invitations:Send',

	mixins: [ContextSender, CourseContentLink],

	propTypes: {
		course: PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			loading: true,
		};
	},

	componentDidMount() {
		this.setCourse();
	},

	setCourse({ course } = this.props) {
		if (course) {
			this.setState({
				course,
				loading: false,
			});
		}
	},

	getContext() {
		const { course } = this.props;
		const path = this.courseHref(course.getID(), 'info');
		return Promise.resolve([
			{
				href: path,
				label: 'Course Info',
			},
			{
				label: t('title'),
			},
		]);
	},

	render() {
		const { loading, course } = this.state;

		if (loading) {
			return <Loading.Mask />;
		}

		return (
			<div className="invitation-send">
				<Banner item={course} />
				<SendForm course={course} />
			</div>
		);
	},
});
