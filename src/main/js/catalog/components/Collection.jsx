import React from 'react';

import Filter from 'common/components/CollectionFilter';
import PageSource from 'nti.lib.interfaces/models/ListBackedPageSource';

import ContextSender from 'common/mixins/ContextSender';

import filters from 'library/Filters';

import Item from './Entry';
import CatalogAccessor from '../mixins/CatalogAccessor';

const ListView = React.createClass({
	displayName: 'ListView',

	mixins: [CatalogAccessor, ContextSender],

	propTypes: {
		list: React.PropTypes.array
	},

	getInitialState () {
		return {sections: []};
	},

	componentDidMount () {
		this.setList(this.props);
	},

	componentWillReceiveProps (props) {
		this.setList(props);
	},

	getContext () {
		return Promise.resolve([]);
	},

	setList (props) {
		let {filter, list} = props;

		if (!list.map) {
			console.warn('this.props.list doesn\'t have a map function? %O', this.props.list);
			return null;
		}

		if(filter && filter.sort) {
			list.sort(filter.sort);
		}

		let sections = [{items: list, label: ''}];

		if (filter && filter.split) {
			sections = filter.split(list);
		}

		this.setState({sections});
		this.setPageSourceData(new PageSource(list));
	},


	render () {

		let {sections} = this.state;

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
				<Filter {...this.props} filters={filters} localStorageKey="catalog">
					<ListView title={this.props.title} />
				</Filter>
			</div>
		);
	}
});
