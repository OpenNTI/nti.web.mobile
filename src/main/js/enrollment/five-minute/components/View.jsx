import React from 'react';
import Router from 'react-router-component';

import path from 'path';

import PanelButton from 'common/components/PanelButton';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import CourseContentLink from 'library/mixins/CourseContentLinkMixin';

import PaymentComplete from './PaymentComplete';
import ConcurrentSent from './ConcurrentSent';
import Admission from './Admission';
import Policy from './Policy';

import Store from '../Store';
import {CONCURRENT_ENROLLMENT_SUCCESS} from '../Constants';


export default React.createClass({
	displayName: 'View',

	mixins: [NavigatableMixin, CourseContentLink, ContextSender],

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
		let {router} = this.refs;
		let href = router ? router.makeHref('') : '';

		let enrollmentOptionsHref = this.makeHref( path.join('/item', this.props.entryId, 'enrollment/' ));

		return Promise.resolve([
			{ label: 'Enroll', href: enrollmentOptionsHref},
			{ label: 'Enroll For Credit', href }
		]);
	},

	onStoreChange (event) {
		let {router} = this.refs;
		if (event.type === CONCURRENT_ENROLLMENT_SUCCESS) {
			router.navigate('/concurrent/');
		}
	},

	render () {

		if ((this.props.enrollment || {}).enrolled) {

			let href = this.courseHref(this.props.courseId);

			return (
				<PanelButton href={href} linkText='Proceed to the course'>
					You are enrolled.
				</PanelButton>
			);
		}

		return (
			<Router.Locations contextual ref="router">

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
