import React from 'react';
import Router from 'react-router-component';

import PanelButton from 'common/components/PanelButton';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import CourseContentLink from 'library/components/CourseContentLinkMixin';

import PaymentComplete from './PaymentComplete';
import ConcurrentSent from './ConcurrentSent';
import Admission from './Admission';

import Store from '../Store';
import {CONCURRENT_ENROLLMENT_SUCCESS} from '../Constants';


export default React.createClass({
	displayName: 'View',

	mixins: [NavigatableMixin, CourseContentLink],

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	},

	onStoreChange (event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case CONCURRENT_ENROLLMENT_SUCCESS:
				this.navigate('credit/concurrent/');
				break;
		}
	},

	render () {

		if ((this.props.enrollment || {}).IsEnrolled) {

			let href = this.courseHref(this.props.courseId);

			return (
				<PanelButton href={href} linkText='Proceed to the course'>
					You are enrolled.
				</PanelButton>
			);
		}

		return (
			<Router.Locations contextual>

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

				<Router.NotFound
					handler={Admission}
					enrollment={this.props.enrollment}
					entryId={this.props.entryId}
				/>
			</Router.Locations>
		);
	}

});
