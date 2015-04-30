import React from 'react';
import Router from 'react-router-component';

import path from 'path';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import CatalogStore from 'catalog/Store';

import NotFound from 'notfound/components/View';

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
	mixins: [BasePathAware, ContextSender, NavigatableMixin],

	propTypes: {
		entryId: React.PropTypes.string.isRequired
	},

	getCourseId () {
		return (getEntry(this.props.entryId)||{}).CourseNTIID;
	},


	getCourseTitle () {
		let e = getEntry(this.props.entryId);
		return e ? e.Title : 'Enrollment';
	},


	getEnrollmentOption (key) {
		let entry = getEntry(this.props.entryId);
		if (entry && entry.EnrollmentOptions) {
			return entry.EnrollmentOptions.Items[key];
		}
		return null;
	},


	getContext () {
		let {router} = this.refs;
		let href = router && path.normalize(router.makeHref('.'));

		return Promise.resolve([{ label: this.getCourseTitle(), href }]);
	},

	render () {
		let courseId = this.getCourseId();

		if (!courseId) {
			return (
				<Router.Locations contextual>
					<Router.NotFound handler={NotFound}/>
				</Router.Locations>
			);
		}

		return (
			<Router.Locations contextual ref="router">

				<Router.Location path="/drop/" handler={DropCourse}
					entryId={this.props.entryId}
					courseId={courseId}/>

				<Router.Location
					path="/store(/*)"
					handler={StoreEnrollmentView}
					entryId={this.props.entryId}
					enrollment={this.getEnrollmentOption(StoreEnrollment)}
					courseId={courseId} />

				<Router.Location
					path="/credit(/*)"
					handler={CreditEnrollmentView}
					entryId={this.props.entryId}
					enrollment={this.getEnrollmentOption(FiveminuteEnrollment)}
					courseId={courseId} />

				<Router.NotFound
					handler={Enroll}
					entryId={this.props.entryId} />

			</Router.Locations>
		);
	}
});
