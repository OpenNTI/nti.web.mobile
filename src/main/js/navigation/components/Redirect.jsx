import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import React from 'react';
import Router from 'react-router-component';

import Logger from '@nti/util-logger';
import { Loading } from '@nti/web-commons';
import { url, isEmpty, equals } from '@nti/lib-commons';

const logger = Logger.get('app:components:Redirect');
const join = (a, b) => (a + '/' + b).replace(/\/{2,}/g, '/');

export default createReactClass({
	displayName: 'Redirect',
	mixins: [Router.NavigatableMixin],

	propTypes: {
		absolute: PropTypes.bool,
		force: PropTypes.bool,
		location: PropTypes.string,
	},

	contextTypes: {
		basePath: PropTypes.string.isRequired,
	},

	performRedirect(props, { basePath }) {
		const { location } = global;
		let { absolute, force } = props;
		let { location: loc } = props;

		const currentFragment = location && location.hash;

		absolute = absolute || loc.startsWith(basePath);

		if (loc && absolute) {
			loc = loc.startsWith(basePath) ? loc : url.join(basePath, loc);
		}

		if (force) {
			logger.debug('Forceful redirect to: %s', loc);
			return location.replace(loc);
		}

		if (loc && loc.indexOf('#') === -1 && currentFragment) {
			loc =
				loc +
				(currentFragment.charAt(0) !== '#' ? '#' : '') +
				currentFragment;
		}

		if (loc) {
			const nav = { replace: true };
			const router = this._getNavigable();

			if (absolute) {
				logger.debug('Redirecting to %s', loc);
				router.getEnvironment().setPath(loc, nav);
			} else {
				const { prefix } = router.state || {};
				if (isEmpty(prefix)) {
					loc = join(basePath, loc);
				}

				logger.debug('Redirecting to %s', prefix + loc);
				router.navigate(loc, nav);
			}
		} else {
			logger.error("Can't redirect to undefined.");
		}
	},

	startRedirect(p, c) {
		clearTimeout(this.pendingRedirect);
		this.pendingRedirect = setTimeout(() => this.performRedirect(p, c), 1);
	},

	componentDidMount() {
		this.startRedirect(this.props, this.context);
	},

	componentDidUpdate(prevProps) {
		if (!equals(this.props, prevProps)) {
			this.startRedirect(this.props, this.context);
		}
	},

	componentWillUnmount() {
		clearTimeout(this.pendingRedirect);
	},

	render() {
		return <Loading.Mask message="Redirecting..." />;
	},
});
