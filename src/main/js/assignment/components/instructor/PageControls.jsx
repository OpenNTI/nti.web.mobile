import React from 'react';
import cx from 'classnames';

import MenuTransitionGroup from './MenuTransitionGroup';
import PageControlsMenuOption from './PageControlsMenuOption';

export default React.createClass({
	displayName: 'PageControls',

	propTypes: {
		currentPage: React.PropTypes.number.isRequired,
		pageSize: React.PropTypes.number.isRequired,
		total: React.PropTypes.number.isRequired,
		onChange: React.PropTypes.func
	},

	getDefaultProps () {
		return {
			onChange () {}
		};
	},

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

	setPage (pageNum) {
		if (pageNum !== this.props.currentPage) {
			this.props.onChange(pageNum);
		}
	},

	render () {

		const {currentPage, pageSize, total} = this.props;
		const {open} = this.state;

		// compute the start item for the given page number
		const start = (pageNum) => total === 0 ? 0 : (pageSize * (pageNum - 1)) + 1;

		// compute the end item for the given page number
		const end = (pageNum) => Math.min(pageSize * pageNum, total);

		// render a menu item for the given page number
		const itemContent = (pageNum, includeTotal = false) => (
			<span>{start(pageNum)} - {end(pageNum)} {includeTotal && `of ${total}`}</span>
		);

		const item = page => (
			<PageControlsMenuOption page={page} onClick={this.setPage} className={cx({'selected': page === currentPage})}>
				{itemContent(page)}
			</PageControlsMenuOption>
		);

		const numPages = Math.ceil(total / pageSize);

		const wrapperclasses = cx('gradebook-page-controls', {open});
		const classes = cx('page-menu', {open});

		return (
			<div className={wrapperclasses} onClick={this.toggleMenu}>
				<div className="menu-label">{itemContent(currentPage, true)}</div>
				<MenuTransitionGroup>
				{open && (
					<ul className={classes} key="pager">
						{Array.from({length: numPages}).map((_, i) => item(i + 1))}
					</ul>
				)}
				</MenuTransitionGroup>
			</div>
		);
	}
});
