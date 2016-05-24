import React from 'react';
import {getService} from 'nti-web-client';
import {TinyLoader as Loading} from 'nti-web-commons';

import {Error as Err} from 'nti-web-commons';
import Empty from './EmptyList';

import SelectionModel from '../utils/ListSelectionModel';

import EntitySearchResultItem from './EntitySearchResultItem';

export default React.createClass({
	displayName: 'UserSearch',

	propTypes: {
		allowAny: React.PropTypes.bool,
		allowContacts: React.PropTypes.bool,

		onChange: React.PropTypes.func,

		query: React.PropTypes.string,

		selection: React.PropTypes.instanceOf(SelectionModel),

		pageSize: React.PropTypes.number
	},


	getInitialState () {
		return {
			page: 1
		};
	},


	componentDidMount () {
		const {props: {query}} = this;
		this.search(query);
	},

	componentWillReceiveProps (nextProps) {
		const {props: {query}} = this;
		const {query: newQuery} = nextProps;

		if (newQuery !== query) {
			this.search(newQuery);
		}
	},


	search (query) {
		const {props: {allowAny, allowContacts}} = this;
		const stillValid = () => query === this.props.query;

		this.setState({error: void 0, results: void 0, page: 1}, ()=>
			getService()
				.then(s => s.getContacts().search(query, allowAny, allowContacts))
				.catch(er => (er.statusCode !== -1) ? Promise.reject(er) : [])
				.then(results => {
					if (!stillValid()) {
						return;
					}

					this.setState({results});
				})
				.catch(error => this.setState({error}))
			);

	},


	onSelectionChange (entity) {
		let {props: {onChange = ()=> {}}} = this;
		return Promise.resolve(onChange(entity));
	},


	showMore (e) {
		e.preventDefault();
		e.stopPropagation();

		let {state: {page}} = this;

		page++;

		this.setState({page});
	},


	render () {
		let {props: {selection, pageSize = 10}, state: {results, error, page}} = this;

		const limit = (_, i) => i < (page * pageSize);
		const hasMore = () => results && (results.length > page * pageSize);

		let Tag = !results || results.length === 0 ? 'div' : 'ul';

		if (error) {
			return ( <Err error={error}/> );
		}

		return (
			<Tag className="entity-search">
				{!results ? (

					<Loading/>

				) : results.length === 0 ? (

					<Empty type="entity-search"/>

				) : results.filter(limit).map(o =>
					<EntitySearchResultItem key={o.getID()} entity={o} selected={selection.isSelected(o)} onChange={this.onSelectionChange} />
				)}

				{!hasMore() ? null : (

					<a href="#" className="button" onClick={this.showMore}>More</a>

				)}
			</Tag>
		);
	}
});
