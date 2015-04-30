import React from 'react';
import Router from 'react-router-component';

import path from 'path';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import CatalogAccessor from 'catalog/mixins/CatalogAccessor';

import NotFound from 'notfound/components/View';

import StoreEnrollmentView from '../store-enrollment/components/View';
import CreditEnrollmentView from '../five-minute/components/View';

import Enroll from './Enroll';
import DropCourse from './DropCourse';

import {StoreEnrollment, FiveminuteEnrollment} from '../Constants';


export default React.createClass({
	displayName: 'enrollment:View',
	mixins: [BasePathAware, CatalogAccessor, ContextSender, NavigatableMixin],

	propTypes: {
		entryId: React.PropTypes.string.isRequired
	},


	getEntry () {
		return this.getCatalogEntry(
			decodeFromURI(
				this.props.entryId));
	},

	getCourseId () {
		return (this.getEntry() || {}).CourseNTIID;
	},


	getCourseTitle () {
		let e = this.getEntry();
		return e ? e.Title : 'Enrollment';
	},


	getEnrollmentOption (key) {
		let entry = this.getEntry();
		if (entry && entry.EnrollmentOptions) {
			return entry.EnrollmentOptions.Items[key];
		}
		return null;
	},


	getContext () {
		let {router} = this.refs;
		let href = router && path.normalize(router.makeHref('../'));

		return Promise.resolve([{ label: this.getCourseTitle(), href }]);
	},

	render () {
		let {entryId} = this.props;
		let courseId = this.getCourseId();

		if (!this.state.catalogLoading && !courseId) {
			return (
				<NotFound/>
			);
		}

		return (
			<Router.Locations contextual ref="router">

				<Router.Location path="/drop/" handler={DropCourse}
					entryId={entryId}
					courseId={courseId}/>

				<Router.Location
					path="/store(/*)"
					handler={StoreEnrollmentView}
					entryId={entryId}
					enrollment={this.getEnrollmentOption(StoreEnrollment)}
					courseId={courseId} />

				<Router.Location
					path="/credit(/*)"
					handler={CreditEnrollmentView}
					entryId={entryId}
					enrollment={this.getEnrollmentOption(FiveminuteEnrollment)}
					courseId={courseId} />

				<Router.NotFound
					handler={Enroll}
					entryId={entryId} />

			</Router.Locations>
		);
	}
});
