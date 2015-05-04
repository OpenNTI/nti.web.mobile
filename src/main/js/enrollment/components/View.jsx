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

const entry = Symbol('cce');

export default React.createClass({
	displayName: 'enrollment:View',
	mixins: [BasePathAware, CatalogAccessor, ContextSender, NavigatableMixin],

	propTypes: {
		entryId: React.PropTypes.string.isRequired
	},


	getEntry () {
		let id = decodeFromURI(this.props.entryId);
		let e = this.getCatalogEntry(id);

		// Enrollment can trigger a catalog reload. If we started on one catalog entry,
		// but the service mapped us to a different one on completing enrollment, the
		// catalog will contain a new and different Entry that represents the same thing,
		// but the ID will not map, and thus, we will have a nill `e` variable. So, to
		// make sure routes continue to work while we are wrapping up the enrollment
		// proccess save the last-known-good Entry, if it fails to come back on a
		// subsequent call, use the cached one IF (AND ONLY IF) the ID matches.
		if (!e) {
			e = this[entry];
			if (!e || e.getID() !== id) {
				e = null;
			}
		} else {
			this[entry] = e;
		}


		return e;
	},

	getCourseId () {
		return (this.getEntry() || {}).CourseNTIID;
	},


	getCourseTitle () {
		let e = this.getEntry();
		return e ? e.Title : 'Enrollment';
	},


	getEnrollmentOption (key) {
		let e = this.getEntry();
		if (e && e.EnrollmentOptions) {
			return e.EnrollmentOptions.Items[key];
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
