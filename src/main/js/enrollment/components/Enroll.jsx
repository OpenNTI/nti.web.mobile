import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Enrollment } from '@nti/web-course';
import { getHistory } from '@nti/web-routing';
import { encodeForURI } from '@nti/lib-ntiids';
import { Mixins } from '@nti/web-commons';
import Logger from '@nti/util-logger';

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
			error: null
		};
	},

	async handleOpenEnroll () {
		const catalogEntry = this.getEntry();
		try {
			await enrollOpen(catalogEntry.NTIID);
		} catch (error) {
			logger.error(error.message);
			this.setState({ error: 'Unable to Enroll.' });
		}

		try {
			await catalogEntry.refresh();
			catalogEntry.onChange();
		} catch (error) {
			logger.error(error.message);
		}
	},

	handleDrop () {
		const base = this.getBasePath();
		const catalogEntry = this.getEntry();
		const entry = encodeForURI(catalogEntry.getID());
		return `${base}catalog/enroll/drop/${entry}/`;
	},

	getRouteFor (option, context) {
		if (context === 'enroll') {
			return () => this.handleOpenEnroll();
		} else if (context === 'drop') {
			return this.handleDrop();
		}
	},

	render () {
		const entry = this.getEntry();
		const { error } = this.state;

		if (!entry) {
			return null;
		}

		return (
			<React.Fragment>
				{error && <p className="error">{error}</p>}
				<Enrollment.Options catalogEntry={entry} />
			</React.Fragment>
		);
	}
});
