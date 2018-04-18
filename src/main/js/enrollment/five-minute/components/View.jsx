import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';
import {Mixins, PanelButton} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import ContextSender from 'common/mixins/ContextSender';
import CourseContentLink from 'library/mixins/CourseContentLink';

import Store from '../Store';
import {CONCURRENT_ENROLLMENT_SUCCESS} from '../Constants';

import PaymentComplete from './PaymentComplete';
import ConcurrentSent from './ConcurrentSent';
import Admission from './Admission';
import Policy from './Policy';


const t = scoped('enrollment.fiveMinuteEnrollment', {
	title: 'Enroll for Credit',
});


export default createReactClass({
	displayName: 'View',

	mixins: [Mixins.NavigatableMixin, CourseContentLink, ContextSender],

	propTypes: {
		courseId: PropTypes.string.isRequired,
		entryId: PropTypes.string.isRequired,
		enrollment: PropTypes.object.isRequired
	},

	attachRef (x) { this.router = x; },

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
			{ label: t('title'), href }
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
			<Router.Locations contextual ref={this.attachRef}>

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
