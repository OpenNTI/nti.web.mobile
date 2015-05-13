import React from 'react';

import cx from 'classnames';

import ActiveState from 'common/components/ActiveState';
import E from 'common/components/Ellipsed';
import Err from 'common/components/Error';
import Loading from 'common/components/Loading';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import isEmpty from 'nti.lib.interfaces/utils/isempty';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';


// const isAnchor = RegExp.prototype.test.bind(/#/);
const isTopic = RegExp.prototype.test.bind(/topic/i);

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
		contentPackage: React.PropTypes.object.isRequired,

		filter: React.PropTypes.string
	},

	getInitialState () {
		return {loading: true};
	},


	getItem (props = this.props) {
		return props.contentPackage;
	},


	componentDidMount () {
		this.fillIn(this.props); },


	componentWillUnmount () {
		let item = this.getItem();
		if (item) {
			item.removeListener('changed', this.itemChanged);
		}
	},


	componentWillReceiveProps (nextProps) {
		let item = this.getItem();
		if (nextProps.item !== item) {
			if (item) {
				item.removeListener('changed', this.itemChanged);
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
			item.addListener('changed', this.itemChanged);
		}

		resolve.then(data => this.setState({loading: false, data}));
	},


	doPropFilter (node) {
		if (!isTopic(node.tag) /*|| isAnchor(node.get('href'))*/) {
			return false;
		}

		let {filter} = this.props;

		return isEmpty(filter) || node.matches(filter);
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
				result.push(
					<li key={result.length}>
						<h1 className={cls}>Package: {t.title}</h1>
						{this.renderTree(t.children, encodeForURI(t.id))}
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

		let prefix = this.makeHref(`/${root}/`);

		return React.createElement('ul', {}, ...list
			.filter(this.doPropFilter)
			.map(item => {
				let {id, title, type, children} = item;

				let tag = TYPE_TAG_MAP[type] || 'div';
				let href = prefix;

				if (id && id !== root) {
					href = prefix + encodeForURI(id) + '/';
				}

				let props = {
					href, title, children: title
				};

				let cls = cx(type, {
					'no-children': children.length === 0
				});

				return (
					<li>
						<ActiveState hasChildren href={href} tag={tag} className={cls}><E tag="a" {...props}/></ActiveState>
						{this.renderTree(children, root)}
					</li>
				);
			}));
	}
});
