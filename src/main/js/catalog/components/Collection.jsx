import React from 'react';

import Filter from 'common/components/CollectionFilter';

import Item from './Entry';

import filters from 'library/Filters';


const ListView = React.createClass({
	render () {

		if (!this.props.list.map) {
			console.warn('this.props.list doesn\'t have a map function? %O', this.props.list);
			return null;
		}

		let {filter, list} = this.props;

		let sections = [{items:list, label: ''}];

		if (filter && filter.split) {
			sections = filter.split(list);
		}

		return (
			<div>
			{sections.map(s=>
			<div className="grid-container" key={s.label}>
				<h3>{s.label}</h3>
				<ul className={'small-block-grid-1'}>
					{s.items.map(o=><Item key={o.NTIID} item={o}/>)}
				</ul>
			</div>
			)}
			</div>
		);
	}

});


export default React.createClass({
	displayName: 'Catalog:Collection',

	propTypes: {
		title: React.PropTypes.string,

		/**
		 *	An array or object with a filter() method.
		 */
		list: React.PropTypes.oneOfType([
			React.PropTypes.array,
			React.PropTypes.shape({
				filter: React.PropTypes.func //shouldn't this be 'map' ?
			})
		]).isRequired,

		filters: React.PropTypes.object
	},

	render () {
		return (
			<div>
				<Filter {...this.props} filters={filters}>
					<ListView title={this.props.title} />
				</Filter>
			</div>
		);
	}
});
