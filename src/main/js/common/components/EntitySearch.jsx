import React from 'react';

import Err from './Error';
import Loading from './TinyLoader';
import SelectableEntity from './SelectableEntity';
import Empty from './EmptyList';

import {getService} from '../utils';
import SelectionModel from '../utils/ListSelectionModel';

export default React.createClass({
	displayName: 'UserSearch',

	propTypes: {
		onChange: React.PropTypes.func,

		query: React.PropTypes.string,

		selection: React.PropTypes.instanceOf(SelectionModel)
	},


	getInitialState () {
		return {};
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
		const stillValid = () => this.isMounted() && query === this.props.query;

		this.setState({error: void 0, results: void 0}, ()=>
			getService()
				.then(s => s.getContacts().search(query))
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


	render () {
		let {props: {selection}, state: {results, error}} = this;

		if (error) {
			return ( <Err error={error}/> );
		}

		return (
			<div className="entity-search">
				{!results ? (

					<Loading/>

				) : results.length === 0 ? (

					<Empty type="entity-search"/>

				) : results.map(o =>

					<SelectableEntity
						key={o.getID()}
						entity={o}
						selected={selection.isSelected(o)}
						onChange={this.onSelectionChange.bind(this, o)}
						/>

				)}
			</div>
		);
	}
});
