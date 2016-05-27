import React from 'react';

import cx from 'classnames';

import {ActiveState} from 'nti-web-commons';
import {Banner} from 'nti-web-commons';
import {Ellipsed} from 'nti-web-commons';
import {Error as Err} from 'nti-web-commons';
import {Loading} from 'nti-web-commons';
import Search from 'common/components/Search';

import {Mixins} from 'nti-web-commons';
import ContextSender from 'common/mixins/ContextSender';

import isEmpty from 'isempty';
import {encodeForURI} from 'nti-lib-ntiids';


const TYPE_TAG_MAP = {
	part: 'h1',
	chapter: 'h3'
};

export default React.createClass({
	displayName: 'TableOfContentsView',
	mixins: [
		Mixins.BasePath,
		ContextSender,
		Mixins.NavigatableMixin
	],

	propTypes: {
		contentPackage: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {
			filter: null,
			loading: true
		};
	},


	getItem (props = this.props) {
		return props.contentPackage;
	},


	componentDidMount () {
		this.fillIn(this.props);
	},


	componentWillReceiveProps (nextProps) {
		let item = this.getItem();
		if (nextProps.item !== item) {
			this.fillIn(nextProps);
		}
	},


	fillIn (props) {
		this.setState({loading: true});
		let item = this.getItem(props);

		let resolve = item ? item.getTablesOfContents() : Promise.reject();

		resolve.then(data => this.setState({loading: false, data}));
	},


	updateFilter (filter) {
		this.setState({filter});
	},


	render () {
		let {data, loading} = this.state;

		if (loading) {
			return (<Loading/>);
		}

		return (
			<div className="table-of-contents">
				<Banner item={this.getItem()} className="head">
					<div className="branding"/>
				</Banner>

				<Search onChange={this.updateFilter}/>

				<ul className="contents">
					{this.renderRoot(data)}
				</ul>
			</div>
		);
	},


	renderRoot (data) {
		let result = [];
		let {length} = data;

		let cls = cx({
			'single-root': length === 1,
			'multi-root': length !== 1
		});

		try {
			for(let t of data) {
				let tree = t;
				result.push(
					<li key={result.length}>
						<h1 className={cls}>Package: {t.title}</h1>
						{this.renderTree(tree.children, encodeForURI(t.id))}
					</li>
				);
			}
		} catch (e) {
			result.push( <Err error={e}/> );
		}

		return result;
	},


	renderTree (list, root) {
		if (isEmpty(list)) {
			return null;
		}

		let {filter} = this.state;
		let prefix = this.makeHref(`/${root}/`);

		list = list.map(item => {
			if (!item.isTopic() /*|| item.isAnchor()*/ || item.isBeyondLevel()) {
				return null;
			}

			let {id, title, type, children} = item;
			let hasFilter = !isEmpty(filter);
			let filtered = hasFilter && !item.matches(filter, false);
			let branch = this.renderTree(children, root);
			let prune = filtered && !branch;

			let tag = TYPE_TAG_MAP[type] || 'div';
			let href = prefix;

			if (id && id !== root) {
				let fragment = '';

				if (item.isAnchor()) {
					id = item.parent.id;
					fragment = '#' + item.getAchorTarget();
				}

				href = prefix + encodeForURI(id) + '/' + fragment;
			}

			let cls = cx(type, {
				'no-children': children.length === 0,
				'filtered-out': filtered
			});

			let props = {
				href, title, children: title
			};

			if (hasFilter && !filtered) {
				delete props.children;
				let re = item.getMatchExp(filter);
				title = title.replace(re, x => `<span class="hit">${x}</span>`);
				props.dangerouslySetInnerHTML = {__html: title};
			}

			return !prune && (
				<li>
					<ActiveState hasChildren href={href} tag={tag} className={cls}><Ellipsed tag="a" {...props}/></ActiveState>
					{branch}
				</li>
			);
		}).filter(x=>x);//only truthy

		if (!list.length) {
			return null;
		}

		return React.createElement('ul', {}, ...list);
	}
});
