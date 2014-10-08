/** @jsx React.DOM */

'use strict';

var React = require('react');
var NavRecord = require('../NavRecord');
var Button = require('common/components/forms/Button');
var Actions = require('../Actions');

var path = require('path');

var NavDrawerItem = React.createClass({
	displayName: 'NavDrawerItem',

	propTypes: {
 		basePath: React.PropTypes.string.isRequired,
 		record: React.PropTypes.instanceOf(NavRecord).isRequired
	},


	_labelClasses: function() {
		var classes = ['navitem'];
		var rec = this.props.record;
		if (rec) {
			if (!rec.clickable ) {
				classes.push('disabled');
			}
			if (rec.href && rec.href === document.location.pathname) {
				classes.push('active');
			}
			if (!rec.clickable && rec.children) {
				classes.push('sectiontitle');
			}
		}
		return classes.join(' ');
	},


	render: function() {
		var record = this.props.record;
		var basePath = this.props.basePath;
		var depth = this.props.depth || 1; // ??
		var classes = this._labelClasses();

		//Nav Items BETTER NOT EVER be external...
		var href = record && record.href && path.join(basePath, record.href);

		var children = record && record.children;
		var label = record && record.label;

		children = children && children.map(function(v, i) {
			return NavDrawerItem({
				record: v,
				depth: depth,
				basePath: basePath,
				key: record.label + i
			});
		});

		return (
			<li>
				{label && <a href={href} className={classes}>{label}</a>}
				{children && <ul>{children}</ul>}
			</li>
		);
	}

});

module.exports = NavDrawerItem;
