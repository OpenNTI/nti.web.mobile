
'use strict';

var React = require('react/addons');
var NavRecord = require('../NavRecord');
var EmptyNavRoot = require('./EmptyNavRoot');

var path = require('path');

var NavDrawerItem = React.createClass({
	displayName: 'NavDrawerItem',

	propTypes: {
 		basePath: React.PropTypes.string.isRequired,
 		record: React.PropTypes.instanceOf(NavRecord).isRequired
	},

	_isActiveItem: function(rec) {
		if (!rec.href) {
			return false;
		}
		return (rec.href === document.location.pathname) || (this.props.basePath + rec.href === document.location.pathname);
	},

	_labelClasses: function() {
		var classes = ['navitem'];
		var rec = this.props.record;
		if (rec) {
			if (!rec.clickable ) {
				classes.push('disabled');
			}
			if (this._isActiveItem(rec)) {
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

		if(record.isEmpty) {
			return <EmptyNavRoot />;
		}

		//Nav Items BETTER NOT EVER be external...
		var href = record && record.href && path.join(basePath, record.href);

		var children = record && record.children;
		var label = record && record.label;

		children = children && children.map(function(v, i) {
			return <NavDrawerItem
				record={v}
				depth={depth}
				basePath={basePath}
				key={record.label + i}
			/>;
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
