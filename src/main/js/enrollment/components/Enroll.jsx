import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Enrollment } from '@nti/web-course';
import { getHistory } from '@nti/web-routing';
import { encodeForURI } from '@nti/lib-ntiids';
import { Mixins, Loading, Prompt } from '@nti/web-commons';
import Logger from '@nti/util-logger';
import {getAppUsername, User} from '@nti/web-client';
import {Contact} from '@nti/web-help';

import ContextSender from 'common/mixins/ContextSender';

import { enrollOpen } from '../Api';
import EnrollmentOptions from '../mixins/EnrollmentMixin';

const logger = Logger.get('enrollment:enroll');

export default createReactClass({
	displayName: 'enroll',
	mixins: [Mixins.BasePath, EnrollmentOptions, ContextSender],

	propTypes: {
		entryId: PropTypes.string
	},

	contextTypes: {
		router: PropTypes.object
	},

	childContextTypes: {
		router: PropTypes.object
	},

	getContext () {
		let path = this.getBasePath();

		return Promise.resolve([
			{
				label: 'Catalog',
				href: path + 'catalog'
			},
			{
				label: 'Enroll',
				href: path + `/catalog/item/${
					this.props.entryId
				}/enrollment`
			}
		]);
	},

	getChildContext () {
		return {
			router: {
				...(this.context.router || {}),
				baseroute: `/mobile/catalog/item/${
					this.props.entryId
				}/enrollment`,
				getRouteFor: this.getRouteFor,
				history: getHistory()
			}
		};
	},

	getInitialState () {
		return {
			error: null,
			pending: false,
			showContact: false
		};
	},

	componentDidCatch (error) {
		logger.error(error.message || error);
		this.setState({ error: 'Unable to Enroll.' });
	},

	async handleOpenEnroll () {
		const catalogEntry = this.getEntry();
		this.setState({ pending: true });

		try {
			await enrollOpen(catalogEntry.NTIID);
			this.setState({ pending: false });
		} catch (error) {
			logger.error(error.message);
			this.setState({ error: 'Unable to Enroll.', pending: false });
		}

		try {
			await catalogEntry.refresh();
			catalogEntry.onChange();
		} catch (error) {
			logger.error(error.message);
			this.setState({ pending: false });
		}
	},

	handleEnroll (option) {
		const catalogEntry = this.getEntry();
		const availableOptions = this.enrollmentOptions(catalogEntry, false);
		const basePath = this.getBasePath();

		for (let available of availableOptions) {
			if (available && available.Class === option.Class) {
				if (option.Class === 'StoreEnrollment') {
					return `${basePath}catalog/enroll/purchase/${catalogEntry.getID()}/`;
				} else if (option.Class === 'OpenEnrollment') {
					return () => this.handleOpenEnroll();
				} else if (option.Class === 'FiveminuteEnrollment') {
					return `${basePath}catalog/enroll/apply/${catalogEntry.getID()}/`;
				}
			}
		}
	},

	handleDrop () {
		const basePath = this.getBasePath();
		const catalogEntry = this.getEntry();
		return `${basePath}catalog/enroll/drop/${encodeForURI(catalogEntry.getID())}/`;
	},

	handleGift () {
		const basePath = this.getBasePath();
		const catalogEntry = this.getEntry();
		return `${basePath}catalog/gift/purchase/${encodeForURI(catalogEntry.getID())}/`;
	},

	handleRedeem () {
		const basePath = this.getBasePath();
		const catalogEntry = this.getEntry();
		return `${basePath}catalog/item/${encodeForURI(catalogEntry.getID())}/redeem`;
	},

	handleProfile () {
		const basePath = this.getBasePath();
		const entity = getAppUsername();
		return `${basePath}profile/${User.encode(entity)}/about/`;
	},

	handleCourse (option) {
		const basePath = this.getBasePath();

		return `${basePath}course/${encodeForURI(option.getCourseID())}/`;
	},

	getRouteFor (option, context) {
		if (option && option.type === 'contact-support') {
			return () => {
				this.setState({
					showContact: true
				});
			};
		}

		const isIMIS = option.MimeType === 'application/vnd.nextthought.courseware.ensyncimisexternalenrollmentoption';
		const isEnrolled = option.MimeType === 'application/vnd.nextthought.courseware.courseinstanceenrollment';
		const isAdmin = option.MimeType === 'application/vnd.nextthought.courseware.courseinstanceadministrativerole';


		if (context === 'open' && (isEnrolled || isAdmin)) {
			return this.handleCourse(option);
		} else if (context === 'enroll') {
			if (isIMIS) {
				return option.enrollmentURL;
			}

			return this.handleEnroll(option);
		} else if (context === 'drop') {
			return this.handleDrop();
		} else if (context === 'gift') {
			return this.handleGift();
		} else if (context === 'redeem') {
			return this.handleRedeem();
		} else if (context === 'complete-profile') {
			return this.handleProfile();
		}
	},


	onHelpDismissed () {
		this.setState({
			showContact: false
		});
	},


	render () {
		const entry = this.getEntry();
		const { error, pending, showContact } = this.state;

		if (!entry) {
			return null;
		}

		if (error) {
			return (
				<p className="enroll-options-error">{error}</p>
			);
		}

		if (pending) {
			return (<Loading.Mask message="Loading..." />);
		}

		return (
			<>
				<Enrollment.Options catalogEntry={entry} />
				{showContact && (
					<Prompt.Dialog onBeforeDismiss={this.onHelpDismissed}>
						<Contact />
					</Prompt.Dialog>
				)}
			</>
		);
	}
});
