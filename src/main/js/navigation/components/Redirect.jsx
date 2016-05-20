import React from 'react';
import Router from 'react-router-component';
import Logger from 'nti-util-logger';
import {Loading} from 'nti-web-commons';

const logger = Logger.get('navigation:components:Redirect');

export default React.createClass({
	displayName: 'Redirect',
	mixins: [Router.NavigatableMixin],

	propTypes: {
		force: React.PropTypes.bool,
		location: React.PropTypes.string
	},

	performRedirect (props) {
		let loc = props.location;
		let location = global.location;
		let currentFragment = location && location.hash;

		if (props.force) {
			logger.debug('Forceful redirect to: %s', loc);
			return location.replace(loc);
		}

		if (loc && loc.indexOf('#') === -1 && currentFragment) {
			loc = loc +
					(currentFragment.charAt(0) !== '#' ? '#' : '') +
					currentFragment;
		}


		// let routes = this.context.router.props.children.map(x=>x.props.path || 'default');
		// logger.debug('Redirecting to %s, routes: %o', loc, routes);
		if (loc) {
			logger.debug('Redirecting to %s', loc);
			this.navigate(loc, {replace: true});
		}
		else {
			logger.error('Can\'t redirect to undefined.');
		}
	},


	startRedirect (p) {
		clearTimeout(this.pendingRedirect);
		this.pendingRedirect = setTimeout(()=> this.performRedirect(p), 1);
	},


	componentDidMount () {
		this.startRedirect(this.props);
	},


	componentWillReceiveProps (props) {
		this.startRedirect(props);
	},


	render () {
		return (<Loading message="Redirecting..."/>);
	}
});
