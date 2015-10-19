import React from 'react';

import cx from 'classnames';

import ActiveState from 'common/components/ActiveState';
import E from 'common/components/Ellipsed';
import Err from 'common/components/Error';
import Loading from 'common/components/Loading';
import Search from 'common/components/Search';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import isEmpty from 'fbjs/lib/isEmpty';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';


const TYPE_TAG_MAP = {
	part: 'h1',
	chapter: 'h3'
};

export default React.createClass({
	displayName: 'TableOfContentsView',
	mixins: [
		BasePathAware,
		ContextSender,
		NavigatableMixin
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


	componentWillUnmount () {
		let item = this.getItem();
		if (item) {
			item.removeListener('change', this.itemChanged);
		}
	},


	componentWillReceiveProps (nextProps) {
		let item = this.getItem();
		if (nextProps.item !== item) {
			if (item) {
				item.removeListener('change', this.itemChanged);
			}
			this.fillIn(nextProps);
		}
	},


	itemChanged () {
		let item = this.getItem();
		let presentation = item ? item.getPresentationProperties() : {};
		let {icon, background, title, label} = presentation;
		this.setState({ icon, background, title, label });
	},


	fillIn (props) {
		this.itemChanged();
		this.setState({loading: true});
		let item = this.getItem(props);

		let resolve = item ? item.getTablesOfContents() : Promise.reject();

		if (item) {
			item.addListener('change', this.itemChanged);
		}

		resolve.then(data => this.setState({loading: false, data}));
	},


	updateFilter (filter) {
		this.setState({filter});
	},


	render () {
		let {data, loading, icon, background, label, title} = this.state;

		if (loading) {
			return (<Loading/>);
		}

		return (
			<div className="table-of-contents">
				<div className="head">
					<img src={background || icon}/>
					<label>
						<h3>{title}</h3>
						<h5>{label}</h5>
					</label>
					<div className="branding"/>
				</div>

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
					<ActiveState hasChildren href={href} tag={tag} className={cls}><E tag="a" {...props}/></ActiveState>
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
