import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { decodeFromURI } from '@nti/lib-ntiids';
import Logger from '@nti/util-logger';
import { Loading, Mixins } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import ContextSender from 'internal/common/mixins/ContextSender';

import { getCatalogEntry } from '../Api';
import * as Actions from '../Actions';
import { DROP_COURSE } from '../Constants';
import Store from '../Store';

import DropOpen from './drop-widgets/DropOpen';
import DropStore from './drop-widgets/DropStore';
import DropFive from './drop-widgets/DropFive';

const logger = Logger.get('enrollment:components:DropCourse');
const t = scoped('enrollment.buttons', {
	viewCatalog: 'View Catalog',
	dropError: 'Unable to drop this course. Please contact support.',
});

export default createReactClass({
	displayName: 'DropCourseDialog',
	mixins: [Mixins.NavigatableMixin, Mixins.BasePath, ContextSender],

	propTypes: {
		courseId: PropTypes.string.isRequired,
		entryId: PropTypes.string,
	},

	getInitialState() {
		return {
			loading: true,
			dropped: false,
		};
	},

	componentDidMount() {
		Store.addChangeListener(this.onEnrollmentChanged);
	},

	componentWillUnmount() {
		Store.removeChangeListener(this.onEnrollmentChanged);
	},

	getContext() {
		return Promise.resolve([
			{
				label: 'Drop',
			},
		]);
	},

	getCourseTitle() {
		return (this.getEntry() || {}).Title;
	},

	getEntry({ entryId } = this.props) {
		const id = decodeFromURI(entryId);
		const entry = this.state[id];

		if (!entry) {
			setTimeout(() => this.resolveEntry(id), 0);
		}

		return entry;
	},

	async resolveEntry(id) {
		if (this.resolving === id) {
			return;
		}

		this.resolving = id;

		this.setState({ loading: true });

		const entry = await getCatalogEntry(id);
		this.setState({ [id]: entry });

		if (this.resolving === id) {
			this.setState({ loading: false });
			delete this.resolving;
		}
	},

	onCancelClicked() {
		global.history.back();
	},

	onConfirmClicked() {
		this.setState({
			loading: true,
		});
		Actions.dropCourse(this.props.courseId);
	},

	onEnrollmentChanged(event) {
		let { courseId } = this.props;
		let { action, result } = event;

		let isError = result && result instanceof Error;

		if (
			action &&
			action.type === DROP_COURSE &&
			action.courseId === courseId
		) {
			this.setState({
				loading: false,
				dropped: !isError,
				error: isError && result,
			});
			// this.navigate('../', {replace: true});
		}
	},

	render() {
		let { dropped, loading, error } = this.state;

		let title = this.getCourseTitle();

		if (loading || !title) {
			return <Loading.Mask />;
		}

		if (dropped) {
			return this.renderPanel(title + ' dropped.');
		}

		if (error && error.statusCode === 403) {
			return this.renderPanel(error.Message || t('dropError'));
		} else if (error) {
			return this.renderPanel(t('dropError'));
		}

		return <div>{this.renderWidgets()}</div>;
	},

	/**
	 * @returns {Element} the appropriate widget for each enrollment option.
	 * this will (almost?) always return a single widget, as
	 * it's unlikely that the user is enrolled in more than
	 * one option for a given course.
	 */
	renderWidgets() {
		const entry = this.getEntry();

		const result = [];

		const widgetMap = {
			'application/vnd.nextthought.courseware.openenrollmentoption': DropOpen,
			'application/vnd.nextthought.courseware.storeenrollmentoption': DropStore,
			'application/vnd.nextthought.courseware.fiveminuteenrollmentoption': DropFive,
		};

		if (!entry) {
			return null;
		}

		for (let option of entry.getEnrollmentOptions()) {
			const { MimeType } = option;
			const Widget = widgetMap[MimeType];

			if (option.enrolled) {
				if (Widget) {
					result.push(
						<Widget
							{...this.props}
							courseTitle={this.getCourseTitle()}
							key={MimeType}
						/>
					);
				} else {
					logger.warn(
						'Enrolled in an unrecognized/supported enrollment option? %O',
						option
					);
				}
			}
		}

		if (result.length === 0) {
			return this.renderPanel(
				"Unable to drop this course. (Perhaps you've already dropped it?)"
			);
		}

		return result;
	},

	renderPanel(body) {
		const catalogHref = this.getBasePath() + 'catalog/';
		return (
			<div className="enrollment-dropped">
				<figure className="notice">
					<div>{body}</div>
				</figure>

				<a className="button tiny" href={catalogHref}>
					{t('viewCatalog')}
				</a>
			</div>
		);
	},
});
