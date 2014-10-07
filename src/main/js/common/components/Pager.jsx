/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var isEmpty = require('dataserverinterface/utils/isempty');

module.exports = React.createClass({
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
		prev: React.PropTypes.object
	},


	getInitialState: function () {
		return {
			next: null, prev: null
		};
	},


	componentDidMount: function () {

	},


	render: function() {
		var prev = this.prop.prev || this.state.prev || {};
		var next = this.prop.next || this.state.next || {};

		return (
			<div className="pager">
				<a className="prev" href={prev.href} title={prev.title}/>
				<a className="next" href={next.href} title={next.title}/>
			</div>
		);
	}
});
