import React from 'react';
import invariant from 'react/lib/invariant';

import NavigatableMixin from '../mixins/NavigatableMixin';

function buildHref (page, props) {
	let ctx = props.navigatableContext;
	if (ctx && !ctx.makeHref) {
		console.warn('navigatableContext missing "makeHref" method');
	}
	if (!ctx || !ctx.makeHref) {
		ctx = this;
	}

	return page && {href: ctx.makeHref(page.ref, false) + '/', title: page.title};
}


export default React.createClass({
	mixins: [NavigatableMixin],
	displayName: 'Pager',

	propTypes: {
		/**
		 * An object that provides an interface to get the current/prev/next
		 * PageSourceItem-like objects.
		 * @type {Store}
		 */
		pageSource: React.PropTypes.object,

		/**
		 * An object that has at least to properties: href, title
		 *	This prop represents the forward link.
		 * @type {PageSourceItem}
		 */
		next: React.PropTypes.object,

		/**
		 * An object that has at least to properties: href, title
		 * 	This prop represents the backward link.
		 * @type {PageSourceItem}
		 */
		prev: React.PropTypes.object,

		/**
		 * The "current" page ID (ntiid)
		 * @type {string}
		 */
		current: React.PropTypes.string,

		/**
		 * The imposed content root.
		 * @type {string}
		 */
		root: React.PropTypes.string,


		/**
		 * Describes which style this pager will take on. "bottom" vs Default.
		 * @type {string}
		 */
		position: React.PropTypes.string,


		/**
		 * Sometimes this Pager component will be rendered inside a higher-level component.
		 * So the NavigatableMixin#makeHref() method will produce the incorrect url. This
		 * allows for specifying whom should make the href.
		 *
		 * @type {ReactElement}
		 */
		navigatableContext: React.PropTypes.element
	},


	getInitialState () {
		return {
			next: null, prev: null
		};
	},


	componentDidMount () {
		this.setupLinks(this.props);
	},


	componentWillReceiveProps (props) {
		this.setupLinks(props);
	},


	setupLinks (props) {
		let pages, source = props.pageSource;
		if (source) {
			invariant(
				!this.props.next && !this.props.prev,
				'[Pager] A value was passed for `next` and/or `prev` as well as a `pageSource`. ' +
				'The prop value will be honored over the state value derived from the pageSource.'
			);

			pages = source.getPagesAround(props.current, props.root);
			this.setState({
				page: pages.index + 1,
				total: pages.total,
				next: buildHref(pages.next, props),
				prev: buildHref(pages.prev, props)
			});
		}
	},


	render () {
		let prev = this.props.prev || this.state.prev || {};
		let next = this.props.next || this.state.next || {};

		if (!prev.href && !next.href) {
			return null;
		}

		if (this.props.position === 'bottom') {
			return (
				<ul className="bottompager">
					<li><a href={prev.href} title={prev.title} className="button secondary tiny radius">Back</a></li>
					<li className="counts">{this.state.total > 1 && this.makeCounts() }</li>
					<li><a href={next.href} title={next.title} className="button secondary tiny radius">Next</a></li>
				</ul>
			);
		}

		return (
			<div className="pager">
				{this.state.total > 1 && this.makeCounts() }
				<a className="prev" href={prev.href} title={prev.title}/>
				<a className="next" href={next.href} title={next.title}/>
			</div>
		);
	},


	makeCounts () {
		let s = this.state,
			page = s.page,
			total = s.total;
		return (
			<div className="counts">
				<strong>{page}</strong> of <strong>{total}</strong>
			</div>
		);
	}
});
