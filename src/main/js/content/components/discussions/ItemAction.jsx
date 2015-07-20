import React from 'react';

import cx from 'classnames';

import {scoped} from 'common/locale';

const t = scoped('CONTENT.DISCUSSIONS.ACTIONS');

export default React.createClass({
	displayName: 'Action',

	propTypes: {
		onClick: React.PropTypes.oneOfType([
				React.PropTypes.bool,
				React.PropTypes.func
			]),

		criteria: React.PropTypes.any,

		item: React.PropTypes.object,

		name: React.PropTypes.string,

		inList: React.PropTypes.bool,

		className: React.PropTypes.string
	},


	getDefaultProps () {
		return {
			onClick () {}
		};
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		this.props.onClick();
	},


	render () {
		let {criteria, inList, item} = this.props;

		if (criteria === false || (typeof criteria === 'function' && criteria(item) === false)) {
			return null;
		}

		let button = this.renderButton();
		return inList ? (<li>{button}</li>) : button;
	},


	renderButton () {
		let {className, name} = this.props;
		let css = cx('action', name, className);
		return (
			<a className={css} href="#" onClick={this.onClick}>{t(name)}</a>
		);
	}
});
