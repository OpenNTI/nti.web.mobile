import React from 'react';

import path from 'path';

import NTIID from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import {scoped} from 'common/locale';

import Actions from '../Actions';
import {DROP_COURSE} from '../Constants';
import Store from '../Store';
import CatalogStore from 'catalog/Store';

import DropOpen from './drop-widgets/DropOpen';
import DropStore from './drop-widgets/DropStore';
import DropFive from './drop-widgets/DropFive';


const t = scoped('ENROLLMENT.BUTTONS');

export default React.createClass({
	displayName: 'DropCourseDialog',

	mixins: [NavigatableMixin, BasePathAware, ContextSender],

	getInitialState () {
		return {
			loading: false,
			dropped: false
		};
	},

	getContext() {
		return Promise.resolve([
			{
				label: this.getCourseTitle(),
				href: path.normalize(this.makeHref('..'))
			},
			{
				label: 'Drop',
				href: path.normalize(this.makeHref(this.getPath()))
			}
		]);
	},

	onCancelClicked () {
		history.back();
	},

	onConfirmClicked () {
		this.setState({
			loading: true
		});
		Actions.dropCourse(this.props.courseId);
	},

	getCourseTitle () {
		let entryId = NTIID.decodeFromURI(this.props.entryId);
		let entry = CatalogStore.getEntry(entryId);
		return entry.Title;
	},

	onEnrollmentChanged (event) {
		let {courseId} = this.props;
		let {action, result} = event;

		let isError = result && result instanceof Error;

		if (action && action.type === DROP_COURSE && action.courseId === courseId) {

			this.setState({
				loading: false,
				dropped: !isError,
				error: isError && result
			});
			// this.navigate('../', {replace: true});
		}
	},

	/**
	* return the appropriate widget for each enrollment option.
	* this will (almost?) always return a single widget, as
	* it's unlikely that the user is enrolled in more than
	* one option for a given course.
	*/
	renderWidgets () {
		let entryId = NTIID.decodeFromURI(this.props.entryId);
		let entry = CatalogStore.getEntry(entryId);
		let items = entry.EnrollmentOptions.Items;
		let enrollmentTypes = Object.keys(items);
		let result = [];
		let widgetMap = {
			OpenEnrollment: DropOpen,
			StoreEnrollment: DropStore,
			FiveminuteEnrollment: DropFive
		};


		enrollmentTypes.forEach(function(type) {
			let option = items[type];
			if (option.IsEnrolled) {
				let Widget = widgetMap[type];
				if(!Widget) {
					console.warn('Enrolled in an unrecognized/supported enrollment option? %O', option);
				}
				result.push(<Widget {...this.props} courseTitle={this.getCourseTitle()} key={type} />);
			}
		}.bind(this));

		if (result.length === 0) {
			result = this._panel('Unable to drop this course. (Perhaps you\'ve already dropped it?)');
		}

		return result;
	},

	componentDidMount () {
		Store.addChangeListener(this.onEnrollmentChanged);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onEnrollmentChanged);
	},

	_panel (body) {
		let catalogHref = this.getBasePath() + 'catalog/';
		return (
			<div className="enrollment-dropped">
				<figure className="notice">
					<div>{body}</div>
				</figure>


				<a className="button tiny" href={catalogHref}>{t('viewCatalog')}</a>
			</div>
		);
	},

	render () {
		let {dropped, loading, error} = this.state;

		if (loading) {
			return <Loading />;
		}

		let title = this.getCourseTitle();

		if (dropped) {
			return this._panel(title + ' dropped.');
		}

		if(error) {
			return this._panel('Unable to drop this course. Please contact support.');
		}

		return (
			<div>
				{this.renderWidgets()}
			</div>
		);
	}

});
