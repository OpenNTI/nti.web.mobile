import React from 'react';
import cx from 'classnames';

import Accessor from './mixins/AssignmentSummaryAccessor';
import ShowAvatars from './mixins/ShowAvatarsChild';

import MenuTransitionGroup from './MenuTransitionGroup';

export default React.createClass({
	displayName: 'OptionsMenu',

	mixins: [Accessor, ShowAvatars],

	getInitialState () {
		return {
			open: false
		};
	},

	toggleMenu () {
		const {open} = this.state;
		this.setState({ open: !open });
	},


	setPageSize (num) {
		this.getStore().setPageSize(num);
	},


	toggleAvatars (event) {
		event.stopPropagation(); // leave the menu open
		this.setShowAvatars(!this.getShowAvatars());
	},

	render () {
		const Store = this.getStore();
		const {open} = this.state;
		const classes = cx('options-menu-wrapper', {open});

		const values = [50, 75, 100];

		return (
			<div className={classes} onClick={this.toggleMenu}>
				<i className="icon-gear-menu" />
				<MenuTransitionGroup>
					{open && (
							<ul className="options-menu">
								<li key="title" className="title">Display</li>
								{values.map(value => (
									<li key={value}
										className={cx({'selected': Store.getPageSize() === value})}
										onClick={() => this.setPageSize(value)}
										>
										{`${value} students per page`}
									</li>
								))}
								<li onClick={this.toggleAvatars}>
									<input type="checkbox" onChange={this.toggleAvatars} checked={this.getShowAvatars()} /> Show Avatars
								</li>
							</ul>
					)}
				</MenuTransitionGroup>
			</div>
		);
	}
});
