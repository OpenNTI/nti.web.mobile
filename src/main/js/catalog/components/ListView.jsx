import React from 'react';

import PageSource from 'nti.lib.interfaces/models/ListBackedPageSource';

import ContextSender from 'common/mixins/ContextSender';

import CatalogAccessor from '../mixins/CatalogAccessor';

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
						{s.items.map(o=><Item key={o.getID()} item={o}/>)}
					</ul>
				</div>
			)}
			</div>
		);
	}

});
