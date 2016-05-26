import React from 'react';
import Router from 'react-router-component';

import path from 'path';

import {PanelButton} from 'nti-web-commons';
import ContextSender from 'common/mixins/ContextSender';
import {Mixins} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

const t = scoped('ENROLLMENT');

import CourseContentLink from 'library/mixins/CourseContentLink';

import PaymentComplete from './PaymentComplete';
import ConcurrentSent from './ConcurrentSent';
import Admission from './Admission';
import Policy from './Policy';

import Store from '../Store';
import {CONCURRENT_ENROLLMENT_SUCCESS} from '../Constants';


export default React.createClass({
	displayName: 'View',

	mixins: [Mixins.NavigatableMixin, CourseContentLink, ContextSender],

	propTypes: {
		courseId: React.PropTypes.string.isRequired,
		entryId: React.PropTypes.string.isRequired,
		enrollment: React.PropTypes.object.isRequired
	},

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	},


	getContext () {
		const {router} = this;
		const href = router ? router.makeHref('') : '';

		const enrollmentOptionsHref = this.makeHref( path.join('/item', this.props.entryId, 'enrollment/' ));

		return Promise.resolve([
			{ label: 'Enroll', href: enrollmentOptionsHref},
			{ label: t('fiveMinuteEnrollmentTitle'), href }
		]);
	},

	onStoreChange (event) {
		const {router} = this;
		if (event.type === CONCURRENT_ENROLLMENT_SUCCESS) {
			router.navigate('/concurrent/');
		}
	},

	render () {

		if ((this.props.enrollment || {}).enrolled) {

			let href = this.courseHref(this.props.courseId);

			return (
				<PanelButton href={href} linkText="Proceed to the course">
					You are enrolled.
				</PanelButton>
			);
		}

		return (
			<Router.Locations contextual ref={x => this.router = x}>

				<Router.Location
					path="/concurrent/*"
					handler={ConcurrentSent}
				/>
				<Router.Location
					path="/paymentcomplete/*"
					handler={PaymentComplete}
					entryId={this.props.entryId}
					courseId={this.props.courseId}
					enrollment={this.props.enrollment}
				/>

				<Router.Location
					path="/policy/"
					handler={Policy}
					entryId={this.props.entryId}
					courseId={this.props.courseId}
					enrollment={this.props.enrollment}
				/>

				<Router.NotFound
					handler={Admission}
					enrollment={this.props.enrollment}
					entryId={this.props.entryId}
				/>
			</Router.Locations>
		);
	}

});
