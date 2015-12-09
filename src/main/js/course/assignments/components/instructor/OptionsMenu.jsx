import React from 'react';
import cx from 'classnames';

import Store from '../../GradebookStore';
import {setBatchSize} from '../../GradebookActions';

export default React.createClass({
	displayName: 'OptionsMenu',

	getInitialState () {
		return {
			open: false
		};
	},

	toggleMenu () {
		this.setState({
			open: !this.state.open
		});
	},

	setNumItems (num) {
		setBatchSize(num);
	},

	render () {

		const {open} = this.state;
		const classes = cx('options-menu-wrapper', {open});

		const values = [50, 75, 100];

		return (
			<div className={classes} onClick={this.toggleMenu}>
				<i className="icon-hamburger-menu" />
				{open && (
					<ul className="options-menu">
						<li key="title" className="title">Display</li>
						{values.map(value => <li className={Store.batchSize === value ? 'selected' : ''} onClick={this.setNumItems.bind(this, value)} key={value}>{`${value} students per page`}</li> )}
						<li>Hide Avatars</li>
					</ul>
				)}
			</div>
		);
	}
});
