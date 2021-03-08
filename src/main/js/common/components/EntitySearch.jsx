import './EntitySearch.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { getService } from '@nti/web-client';
import { Selection } from '@nti/lib-commons';
import { EmptyList as Empty, Error as Err, Loading } from '@nti/web-commons';

import EntitySearchResultItem from './EntitySearchResultItem';

export default class extends React.Component {
	static displayName = 'UserSearch';

	static propTypes = {
		allowAny: PropTypes.bool,
		allowContacts: PropTypes.bool,

		onChange: PropTypes.func,

		query: PropTypes.string,

		selection: PropTypes.instanceOf(Selection.EntitySelectionModel),

		pageSize: PropTypes.number,
	};

	state = {
		page: 1,
	};

	componentDidMount() {
		const {
			props: { query },
		} = this;
		this.search(query);
	}

	componentDidUpdate({ query }) {
		const {
			props: { query: newQuery },
		} = this;
		if (newQuery !== query) {
			this.search(newQuery);
		}
	}

	search = query => {
		const {
			props: { allowAny, allowContacts },
		} = this;
		const stillValid = () => query === this.props.query;

		this.setState({ error: void 0, results: void 0, page: 1 }, () =>
			getService()
				.then(s =>
					s
						.getContacts()
						.search(query, {
							allowAnyEntityType: allowAny,
							allowContacts,
						})
				)
				.catch(er => (er !== 'aborted' ? Promise.reject(er) : []))
				.then(results => {
					if (!stillValid()) {
						return;
					}

					this.setState({ results });
				})
				.catch(error => {
					if (stillValid()) {
						this.setState({
							error: { ...error, message: error.Message },
						});
					}
				})
		);
	};

	onSelectionChange = entity => {
		let {
			props: { onChange = () => {} },
		} = this;
		return Promise.resolve(onChange(entity));
	};

	showMore = e => {
		e.preventDefault();
		e.stopPropagation();

		let {
			state: { page },
		} = this;

		page++;

		this.setState({ page });
	};

	render() {
		let {
			props: { selection, pageSize = 10 },
			state: { results, error, page },
		} = this;

		const limit = (_, i) => i < page * pageSize;
		const hasMore = () => results && results.length > page * pageSize;

		let Tag = !results || results.length === 0 ? 'div' : 'ul';

		if (error) {
			return <Err error={error} />;
		}

		return (
			<Tag className="entity-search">
				{!results ? (
					<Loading.Ellipse />
				) : results.length === 0 ? (
					<Empty type="entity-search" />
				) : (
					results
						.filter(limit)
						.map(o => (
							<EntitySearchResultItem
								key={o.getID()}
								entity={o}
								selected={selection.isSelected(o)}
								onChange={this.onSelectionChange}
							/>
						))
				)}

				{!hasMore() ? null : (
					<a href="#" className="button" onClick={this.showMore}>
						More
					</a>
				)}
			</Tag>
		);
	}
}
