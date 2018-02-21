import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import AssignmentSummary from '../bindings/AssignmentSummary';

import MenuTransitionGroup from './MenuTransitionGroup';
import FilterMenuOption from './FilterMenuOption';

const OPTIONS = [
	{label: 'Enrolled Students', value: 'ForCredit'},
	{label: 'Open Students', value: 'Open'}
];

const killEvent = (e) => {
	e.stopPropagation();
	e.preventDefault();
};

export default
@AssignmentSummary.connect
class FilterMenu extends React.Component {
	static propTypes = {
		store: PropTypes.object
	}

	state = {
		open: false
	}


	optionClicked = (option) => {
		this.setFilter(option.value);
		this.hideMenu();
	}


	searchChanged = ({target: {value}}) => {
		clearTimeout(this.searchTimeout);
		this.searchTimeout = setTimeout(() => this.setSearch(value), 1000);
	}


	setSearch = (value) => {
		this.props.store.setSearch(value);
	}


	setFilter = (value) => {
		this.props.store.setFilter(value);
	}


	hideMenu = () => {
		this.setState({
			open: false
		});
	}


	toggleMenu = () => {
		this.setState(({open}) => ({open: !open}));
	}


	render () {
		const {store} = this.props;
		const filterValue = store.getFilter();
		const selectedOption = OPTIONS.find(option => option.value === filterValue) || OPTIONS[0];
		const search = store.getSearch() || '';
		const menuLabel = search.length > 0 ? `Search ${selectedOption.label}: ${search}` : selectedOption.label;

		const {state: {open}} = this;

		const wrapperClasses = cx('filter-menu-wrapper', {open});

		return (
			<div className={wrapperClasses} onClick={this.toggleMenu}>
				<div className="menu-label">{menuLabel} <span className="count">({store.getTotal()})</span></div>
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
}
