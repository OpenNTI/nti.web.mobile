import React from 'react';
import Router from 'react-router-component';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import CatalogStore from 'catalog/Store';

import StoreEnrollmentView from '../store-enrollment/components/View';
import CreditEnrollmentView from '../five-minute/components/View';

import Enroll from './Enroll';
import DropCourse from './DropCourse';

import {StoreEnrollment, FiveminuteEnrollment} from '../Constants';

function getEntry(entryId) {
	return CatalogStore.getEntry(decodeFromURI(entryId));
}


export default React.createClass({
	displayName: 'enrollment:View',

	propTypes: {
		entryId: React.PropTypes.string.isRequired
	},

	getCourseId () {
		return (getEntry(this.props.entryId)||{}).CourseNTIID;
	},

	getEnrollmentOption (key) {
		let entry = getEntry(this.props.entryId);
		if (entry && entry.EnrollmentOptions) {
			return entry.EnrollmentOptions.Items[key];
		}
		return null;
	},

	render () {
		return (
			<Router.Locations contextual>

				<Router.Location path="/drop/" handler={DropCourse}
					entryId={this.props.entryId}
					courseId={this.getCourseId()}/>

				<Router.Location
					path="/store(/*)"
					handler={StoreEnrollmentView}
					entryId={this.props.entryId}
					enrollment={this.getEnrollmentOption(StoreEnrollment)}
					courseId={this.getCourseId()} />

				<Router.Location
					path="/credit(/*)"
					handler={CreditEnrollmentView}
					entryId={this.props.entryId}
					enrollment={this.getEnrollmentOption(FiveminuteEnrollment)}
					courseId={this.getCourseId()} />

				<Router.NotFound
					handler={Enroll}
					entryId={this.props.entryId} />

			</Router.Locations>
		);
	}
});
