import React from 'react';

import cx from 'classnames';

import {scoped} from 'common/locale';

const t = scoped('DISCUSSIONS.ACTIONS');

const ICON_MAP = {
	'delete': 'trash',
	'flag.metoo': 'flag'
};

const getIconClass = x => (x = ICON_MAP[x] || x, `icon-${x}`);

export default React.createClass({
	displayName: 'Action',

	propTypes: {
		onClick: React.PropTypes.oneOfType([
			React.PropTypes.bool,
			React.PropTypes.func
		]),

		criteria: React.PropTypes.any,

		name: React.PropTypes.string,

		inList: React.PropTypes.bool,

		className: React.PropTypes.string,

		iconOnly: React.PropTypes.bool
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
		let {criteria, inList} = this.props;

		if (criteria === false) {
			return null;
		}

		let button = this.renderButton();
		return inList ? (<li>{button}</li>) : button;
	},


	renderButton () {
		let {className, name, iconOnly} = this.props;
		let css = cx('discussion-item-action', name, className, {'icon-only': iconOnly});
		return (
			<a className={css} href="#" onClick={this.onClick}>
				<i className={getIconClass(name)}/>
				{iconOnly ? null : t(name)}
			</a>
		);
	}
});
