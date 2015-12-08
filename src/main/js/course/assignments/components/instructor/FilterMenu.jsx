import React from 'react';
import TransitionGroup from 'react-addons-css-transition-group';

import {setFilter, setSearch} from '../../GradebookActions';
import Store from '../../GradebookStore';

const OPTIONS = [
	{label: 'Enrolled Students', value: 'ForCredit'},
	{label: 'Open Students', value: 'Open'}
];

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

	render () {

		const filterValue = Store.filter;
		const selected = OPTIONS.find(option => option.value === filterValue);

		return (
			<div className="filter-menu-wrapper">
				<div className="menu-label" onClick={this.showMenu}>{selected.label}</div>
				{this.state.open && (
					<TransitionGroup
						transitionName="fadeOutIn"
						transitionAppear={true}
						transitionAppearTimeout={500}
						transitionEnterTimeout={500}
						transitionLeaveTimeout={500}
					>
						<ul key="filter-menu" className="filter-menu">
							<li key="title" className="title">Display</li>
							{OPTIONS.map(option => <li key={option.value} className={option === selected ? 'selected' : ''} onClick={this.optionClicked.bind(this, option)}>{option.label}</li>)}
							<li key="search" className="search-item"><input defaultValue={Store.search} type="search" onChange={this.searchChanged} placeholder="Search Students"/></li>
						</ul>
					</TransitionGroup>
				)}
			</div>

		);
	}
});
