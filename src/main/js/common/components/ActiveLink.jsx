import React from 'react';
import Router from 'react-router-component';

import cx from 'classnames';

const Link = Router.Link;

//This is duplicating "common/components/ActiveState"

export default React.createClass({
	displayName: 'ActiveLink',

	mixins: [Router.NavigatableMixin],

	propTypes: {
		href: React.PropTypes.string,
		className: React.PropTypes.string,
		children: React.PropTypes.any
	},

	componentWillMount () {
		console.warn('ActiveLink component is deprecated. Use ActiveState instead.');
	},

	isActive () {
		let {href} = this.props;
		let path = this.getPath();
		try {
			path = this.context.router.getMatch().matchedPath;
			return path === href;
		} catch (e) {
			console.warn('Strange', e.stack || e.message || e);
		}

		return path.indexOf(href) === 0;
	},

	render () {
		let {className} = this.props;

		return (
			<Link {...this.props} className={cx(className, {active: this.isActive()})}/>
		);
	}

});
