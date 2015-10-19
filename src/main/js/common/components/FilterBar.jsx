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
		const {props: {list}} = this;
		if(filter && list.filter) {
			return list.filter(filter.test).length;
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
		let {props: {filters = []}} = this;
		return filters.length === 0 ? null : (
			<ul className="button-group filters">
				{filters.map(this.renderFilterLink)}
			</ul>
		);
	},


	renderFilterLink (filter) {
		let {name, kind} = filter;

		const {props: {filter: propsFilter}} = this;

		let isActive = propsFilter.kind === filter.kind || propsFilter.name === filter.name; // this.props.filtername.toLowerCase() === name.toLowerCase();

		return (
			<li key={name} className={isActive ? 'active' : null}>
				<Link className="tiny button" href={`/${kind}`}>
					<span className="filtername">{name}</span>
					{' '/*preserves the space between spans*/}
					<span className="count">{this.getItemCount(filter)}</span>
				</Link>
			</li>
		);
	}

});
