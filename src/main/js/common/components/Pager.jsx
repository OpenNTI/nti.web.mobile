/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var invariant = require('react/lib/invariant');

var NavigatableMixin = require('../mixins/NavigatableMixin');

module.exports = React.createClass({
	mixins: [NavigatableMixin],
	displayName: 'Pager',

	propType: {
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
		 * @type {String}
		 */
		current: React.PropTypes.string,

		/**
		 * The imposed content root.
		 * @type {String}
		 */
		root: React.PropTypes.string
	},


	getInitialState: function () {
		return {
			next: null, prev: null
		};
	},


	componentDidMount: function () {
		this.__setupLinks(this.props);
	},


	componentWillReceiveProps: function(props) {
		this.__setupLinks(props);
	},


	__setupLinks: function (props) {
		var pages, source = props.pageSource;
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
				next: this.__buildHref(pages.next),
				prev: this.__buildHref(pages.prev)
			});
		}
	},


	__buildHref: function(page) {
		return page && {href :this.makeHref(page.ref, false) + '/', title: page.title};
	},


	render: function() {
		var prev = this.props.prev || this.state.prev || {};
		var next = this.props.next || this.state.next || {};

		if (this.props.bottom) {
			return (
				<ul className="bottompager">
					<li><a href={prev.href} title={prev.title} className="button secondary tiny radius">Back</a></li>
					<li className="counts">{this.state.total > 1 && this._makeCounts() }</li>
					<li><a href={next.href} title={next.title} className="button secondary tiny radius">Next</a></li>
				</ul>
			);
		}

		return (
			<div className="pager">
				{this.state.total > 1 && this._makeCounts() }
				<a className="prev" href={prev.href} title={prev.title}/>
				<a className="next" href={next.href} title={next.title}/>
			</div>
		);
	},


	_makeCounts: function() {
		var s = this.state,
			page = s.page,
			total = s.total;
		return (
			<div className="counts">
				<strong>{page}</strong> of <strong>{total}</strong>
			</div>
		);
	}
});
