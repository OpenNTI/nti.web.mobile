import React from 'react';
import cx from 'classnames';

import {setFilter, setSearch} from '../../GradebookActions';
import Store from '../../GradebookStore';

import MenuTransitionGroup from './MenuTransitionGroup';

const OPTIONS = [
	{label: 'Enrolled Students', value: 'ForCredit'},
	{label: 'Open Students', value: 'Open'}
];

const killEvent = (e) => {
	e.stopPropagation();
	e.preventDefault();
};

export default React.createClass({
	displayName: 'FilterMenu',

	getInitialState () {
		return {
			open: false
		};
	},

	optionClicked (option) {
		this.setFilter(option.value);
		this.hideMenu();
	},

	searchChanged (event) {
		let {searchTimeout} = this.state;
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		searchTimeout = setTimeout(this.setSearch.bind(this, event.target.value), 1000);
		this.setState({
			searchTimeout
		});
	},

	setSearch (value) {
		setSearch(value);
	},

	setFilter (value) {
		setFilter(value);
	},

	showMenu () {
		this.setState({
			open: true
		});
	},

	hideMenu () {
		this.setState({
			open: false
		});
	},

	toggleMenu () {
		this.setState({
			open: !this.state.open
		});
	},

	render () {

		const filterValue = Store.filter;
		const selectedOption = OPTIONS.find(option => option.value === filterValue);
		const search = Store.search || '';
		const menuLabel = search.length > 0 ? `Search ${selectedOption.label}: ${search}` : selectedOption.label;

		const wrapperClasses = cx('filter-menu-wrapper', {'open': this.state.open});

		return (
			<div className={wrapperClasses} onClick={this.toggleMenu}>
				<div className="menu-label">{menuLabel} <span className="count">({Store.count})</span></div>
				{this.state.open && (
					<MenuTransitionGroup>
						<ul key="filter-menu" className="filter-menu">
							<li key="title" className="title">Display</li>
							{OPTIONS.map(option => <li key={option.value} className={option === selectedOption ? 'selected' : ''} onClick={this.optionClicked.bind(this, option)}>{option.label}</li>)}
							<li key="search" className="search-item" onClick={killEvent}><input defaultValue={Store.search} type="search" onChange={this.searchChanged} placeholder="Search Students"/></li>
						</ul>
					</MenuTransitionGroup>
				)}
			</div>

		);
	}
});
