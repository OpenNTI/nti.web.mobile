import React from 'react';
import cx from 'classnames';

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
		const classes = cx('options-menu', {open});

		return (
			<div className={classes} onClick={this.toggleMenu}>
				<i className="icon-hamburger-menu" />
				{open && (
					<ul>
						<li key="title" className="title">Display</li>
						<li onClick={this.setNumItems.bind(this, 1)} key="50-items">50 Items</li>
						<li onClick={this.setNumItems.bind(this, 2)} key="75-items">75 Items</li>
						<li onClick={this.setNumItems.bind(this, 3)} key="100-items">100 Items</li>
					</ul>
				)}
			</div>
		);
	}
});
