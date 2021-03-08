import './ItemAction.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

const DEFAULT_TEXT = {
	reply: 'Reply',
	share: 'Share',
	edit: 'Edit',
	flag: 'Report',
	flagged: 'Reported',
	delete: 'Delete',
};

const t = scoped('discussions.actions', DEFAULT_TEXT);

const ICON_MAP = {
	delete: 'trash',
	'flag.metoo': 'flag',
};

const getIconClass = x => ((x = ICON_MAP[x] || x), `icon-${x} small`);

export default class extends React.Component {
	static displayName = 'Action';

	static propTypes = {
		onClick: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

		criteria: PropTypes.any,

		name: PropTypes.string,

		inList: PropTypes.bool,

		className: PropTypes.string,

		iconOnly: PropTypes.bool,
	};

	static defaultProps = {
		onClick() {},
	};

	onClick = e => {
		e.preventDefault();
		e.stopPropagation();

		this.props.onClick();
	};

	render() {
		let { criteria, inList } = this.props;

		if (criteria === false) {
			return null;
		}

		let button = this.renderButton();
		return inList ? <li>{button}</li> : button;
	}

	renderButton = () => {
		let { className, name, iconOnly } = this.props;
		let css = cx('discussion-item-action', name, className, {
			'icon-only': iconOnly,
		});
		return (
			<a className={css} href="#" onClick={this.onClick}>
				<i className={getIconClass(name)} />
				{iconOnly ? null : t(name)}
			</a>
		);
	};
}
