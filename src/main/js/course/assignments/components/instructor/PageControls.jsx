import React from 'react';
import cx from 'classnames';

export default React.createClass({
	displayName: 'PageControls',

	propTypes: {
		currentPage: React.PropTypes.number.isRequired,
		pageSize: React.PropTypes.number.isRequired,
		total: React.PropTypes.number.isRequired,
		onChange: React.PropTypes.func
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
		if (pageNum !== this.props.currentPage && typeof this.props.onChange === 'function') {
			this.props.onChange(pageNum);
		}
	},

	render () {

		const {currentPage, pageSize, total} = this.props;
		const {open} = this.state;

		// compute the start item for the given page number
		const start = (pageNum) => (pageSize * (pageNum - 1)) + 1;

		// compute the end item for the given page number
		const end = (pageNum) => Math.min(pageSize * pageNum, total);

		// render a menu item for the given page number
		const itemContent = (pageNum, includeTotal = false) => (
			<span>{start(pageNum)} - {end(pageNum)} {includeTotal && `of ${total}`}</span>
		);

		const numPages = total / pageSize;

		let items = [];
		if(open) {
			for(let i = 1; i < numPages + 1; i++) {
				const classes = cx({'selected': i === this.props.currentPage});
				items.push(<li className={classes} key={`page-${i}`} onClick={this.setPage.bind(this, i)}>{itemContent(i)}</li>);
			}
		}

		const classes = cx('page-menu', {open});

		return (
			<div className="gradebook-page-controls" onClick={this.toggleMenu}>
				<div className="menu-label">{itemContent(currentPage, true)}</div>
				{open && <ul className={classes}>{items}</ul>}
			</div>
		);
	}
});
