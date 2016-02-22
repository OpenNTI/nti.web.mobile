import React from 'react';

import PageSource from 'nti-lib-interfaces/lib/models/ListBackedPageSource';

import ContextSender from 'common/mixins/ContextSender';

import CatalogAccessor from '../mixins/CatalogAccessor';

import passesFilter from '../catalog-list-search';

import Item from './Entry';

export default React.createClass({
	displayName: 'ListView',

	mixins: [CatalogAccessor, ContextSender],

	propTypes: {
		filter: React.PropTypes.object,
		list: React.PropTypes.oneOfType([
			React.PropTypes.array,
			React.PropTypes.shape({
				map: React.PropTypes.func,
				sort: React.PropTypes.func
			})
		])
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

	setList (props) {
		let {filter, list} = props;

		if (!list || !list.map) {
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
		this.setPageSourceData(new PageSource(sections.reduce((a, s)=> a.concat(s.items), [])));
	},

	onSearchChange () {
		const search = this.search.value;
		this.setState({
			search
		});
	},

	render () {

		let {sections, search} = this.state;

		return (
			<div>
				<div className="search"><input type="text" ref={x => this.search = x} onChange={this.onSearchChange} /></div>
			{sections.map(s=>
			{
				const list = s.items.filter(passesFilter.bind(null, search));
				return list.length > 0 && (
					<div className="grid-container" key={s.label}>
						<h3>{s.label}</h3>
						<ul className={'small-block-grid-1'}>
							{list.map(o => <Item key={o.getID()} item={o}/>)}
						</ul>
					</div>
				);
			}
			)}
			</div>
		);
	}

});
