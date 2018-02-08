import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {decodeFromURI} from 'nti-lib-ntiids';
import Logger from 'nti-util-logger';
import {Loading, Mixins} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import ContextSender from 'common/mixins/ContextSender';
import CatalogStore from 'catalog/Store';
import {LOADED_CATALOG} from 'catalog/Constants';

import * as Actions from '../Actions';
import {DROP_COURSE} from '../Constants';
import Store from '../Store';

import DropOpen from './drop-widgets/DropOpen';
import DropStore from './drop-widgets/DropStore';
import DropFive from './drop-widgets/DropFive';

const logger = Logger.get('enrollment:components:DropCourse');
const t = scoped('enrollment.buttons', {
	viewCatalog: 'View Catalog',
});

export default createReactClass({
	displayName: 'DropCourseDialog',
	mixins: [Mixins.NavigatableMixin, Mixins.BasePath, ContextSender],

	propTypes: {
		courseId: PropTypes.string.isRequired,
		entryId: PropTypes.string
	},

	getInitialState () {
		return {
			loading: false,
			dropped: false,
			catalogLoaded: false
		};
	},

	getContext () {
		return Promise.resolve([
			{
				label: 'Drop'
			}
		]);
	},

	componentDidMount () {
		let entryId = decodeFromURI(this.props.entryId);
		let entry = CatalogStore.getEntry(entryId);

		if (entry && !entry.loading) {
			this.setState({
				catalogLoaded: true
			});
		}

		Store.addChangeListener(this.onEnrollmentChanged);
		CatalogStore.addChangeListener(this.catalogStoreChange);
	},

	catalogStoreChange (event) {
		let action = (event || {}).type;

		const handlers = {
			[LOADED_CATALOG]: () => {
				this.setState({
					catalogLoaded: true
				});
			}
		};

		if(action) {
			let handler = handlers[action];
			if (handler) {
				handler();
			}
			else {
				logger.debug('Unrecognized CatalogStore change event: %o', event);
			}
		}
	},

	onCancelClicked () {
		global.history.back();
	},

	onConfirmClicked () {
		this.setState({
			loading: true
		});
		Actions.dropCourse(this.props.courseId);
	},

	getCourseTitle () {
		let entryId = decodeFromURI(this.props.entryId);
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
	 * @return {Class} the appropriate widget for each enrollment option.
	 * this will (almost?) always return a single widget, as
	 * it's unlikely that the user is enrolled in more than
	 * one option for a given course.
	 */
	renderWidgets () {
		let entryId = decodeFromURI(this.props.entryId);
		let entry = CatalogStore.getEntry(entryId);

		let result = [];

		let widgetMap = {
			'application/vnd.nextthought.courseware.openenrollmentoption': DropOpen,
			'application/vnd.nextthought.courseware.storeenrollmentoption': DropStore,
			'application/vnd.nextthought.courseware.fiveminuteenrollmentoption': DropFive
		};


		for (let option of entry.getEnrollmentOptions()) {
			let {MimeType} = option;
			let Widget = widgetMap[MimeType];

			if (option.enrolled) {
				if (Widget) {
					result.push(<Widget {...this.props} courseTitle={this.getCourseTitle()} key={MimeType} />);
				} else {
					logger.warn('Enrolled in an unrecognized/supported enrollment option? %O', option);
				}
			}
		}

		if (result.length === 0) {
			result = this.renderPanel('Unable to drop this course. (Perhaps you\'ve already dropped it?)');
		}

		return result;
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onEnrollmentChanged);
		CatalogStore.removeChangeListener(this.catalogStoreChange);
	},

	renderPanel (body) {
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
		let {dropped, loading, catalogLoaded, error} = this.state;

		let title = this.getCourseTitle();

		if (loading || !catalogLoaded || !title) {
			return <Loading.Mask />;
		}

		if (dropped) {
			return this.renderPanel(title + ' dropped.');
		}

		if(error) {
			return this.renderPanel('Unable to drop this course. Please contact support.');
		}

		return (
			<div>
				{this.renderWidgets()}
			</div>
		);
	}

});
