import React from 'react';

import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'FilterBar',

	propTypes: {
		filters: React.PropTypes.array,
		filter: React.PropTypes.object,
		list: React.PropTypes.object,
		title: React.PropTypes.string
	},


	getItemCount (filter) {
		if(filter && this.props.list.filter) {
			return this.props.list.filter(filter.filter).length;
		}
		return 0;
	},

	render () {
		return (
			<div className="grid-container">
				<h2>{this.props.title}</h2>
				{this.renderFilterBar()}
			</div>
		);
	},


	renderFilterBar  () {
		let filters = this.props.filters || [];
		return filters.length === 0 ? null : (
			<ul className="button-group filters">
				{filters.map(this.renderFilterLink)}
			</ul>
		);
	},


	renderFilterLink (filter) {
		let {name, path} = filter;

		let propsFilter = this.props.filter;

		let isActive = propsFilter.path === filter.path || propsFilter.name === filter.name; // this.props.filtername.toLowerCase() === name.toLowerCase();

		return (
			<li key={name} className={isActive ? 'active' : null}>
				<Link className="tiny button" href={`/${path}`}>
					<span className="filtername">{name}</span>
					{' '/*preserves the space between spans*/}
					<span className="count">{this.getItemCount(filter)}</span>
				</Link>
			</li>
		);
	}

});
