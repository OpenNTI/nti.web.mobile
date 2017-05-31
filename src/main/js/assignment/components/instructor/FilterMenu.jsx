import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import MenuTransitionGroup from './MenuTransitionGroup';
import Accessor from './mixins/AssignmentSummaryAccessor';
import FilterMenuOption from './FilterMenuOption';

const OPTIONS = [
	{label: 'Enrolled Students', value: 'ForCredit'},
	{label: 'Open Students', value: 'Open'}
];

const killEvent = (e) => {
	e.stopPropagation();
	e.preventDefault();
};

export default createReactClass({
	displayName: 'FilterMenu',
	mixins: [Accessor],

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
		this.getStore().setSearch(value);
	},

	setFilter (value) {
		this.getStore().setFilter(value);
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
		const Store = this.getStore();
		const filterValue = Store.getFilter();
		const selectedOption = OPTIONS.find(option => option.value === filterValue) || OPTIONS[0];
		const search = Store.getSearch() || '';
		const menuLabel = search.length > 0 ? `Search ${selectedOption.label}: ${search}` : selectedOption.label;

		const {state: {open}} = this;

		const wrapperClasses = cx('filter-menu-wrapper', {open});

		return (
			<div className={wrapperClasses} onClick={this.toggleMenu}>
				<div className="menu-label">{menuLabel} <span className="count">({Store.getTotal()})</span></div>
				<MenuTransitionGroup>
					{open && (
							<ul key="filter-menu" className="filter-menu">
								<li key="title" className="title">Display</li>
								{OPTIONS.map(option => (
									<FilterMenuOption
										key={option.value}
										option={option}
										className={cx({'selected': option === selectedOption})}
										onClick={this.optionClicked} />
								))}
								<li key="search" className="search-item" onClick={killEvent}>
									<input type="search"
										defaultValue={search}
										onChange={this.searchChanged}
										placeholder="Search Students"
										/>
								</li>
							</ul>
					)}
				</MenuTransitionGroup>
			</div>

		);
	}
});
