import React from 'react';
import cx from 'classnames';

import Store from '../../GradebookStore';
import {setBatchSize} from '../../GradebookActions';

import ShowAvatars from './mixins/ShowAvatarsChild';
import MenuTransitionGroup from './MenuTransitionGroup';

export default React.createClass({
	displayName: 'OptionsMenu',

	mixins: [ShowAvatars],

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

	toggleAvatars (event) {
		event.stopPropagation(); // leave the menu open
		this.setShowAvatars(!this.getShowAvatars());
	},

	render () {

		const {open} = this.state;
		const classes = cx('options-menu-wrapper', {open});

		const values = [50, 75, 100];

		return (
			<div className={classes} onClick={this.toggleMenu}>
				<i className="icon-gear-menu" />
				{open && (
					<MenuTransitionGroup>
						<ul className="options-menu">
							<li key="title" className="title">Display</li>
							{values.map(value => <li className={Store.batchSize === value ? 'selected' : ''} onClick={this.setNumItems.bind(this, value)} key={value}>{`${value} students per page`}</li> )}
							<li onClick={this.toggleAvatars}><input type="checkbox" onChange={this.toggleAvatars} checked={this.getShowAvatars()} /> Show Avatars</li>
						</ul>
					</MenuTransitionGroup>
				)}
			</div>
		);
	}
});
