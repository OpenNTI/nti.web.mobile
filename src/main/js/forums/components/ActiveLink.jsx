import React from 'react';
import Router from 'react-router-component';

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

	isActive () {
		return this.getPath().indexOf(this.props.href) === 0;
	},

	render () {

		let cssClass = [this.props.className || ''];
		if (this.isActive()) {
			cssClass.push('active');
		}

		return (
			<Link {...this.props} className={cssClass.join(' ')}>{this.props.children}</Link>
		);
	}

});
