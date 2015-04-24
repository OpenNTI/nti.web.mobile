import React from 'react';
import Router from 'react-router-component';
import Loading from 'common/components/Loading';

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
			console.debug('Forceful redirect to: %s', loc);
			return location.replace(loc);
		}

		if (loc && loc.indexOf('#') === -1 && currentFragment) {
			loc = loc +
					(currentFragment.charAt(0) !== '#' ? '#' : '') +
					currentFragment;
		}


		// let routes = this.context.router.props.children.map(x=>x.props.path || 'default');
		// console.debug('Redirecting to %s, routes: %o', loc, routes);
		console.debug('Redirecting to %s', loc);
		this.navigate(loc, {replace: true});
	},


	startRedirect(p) {
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
