/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var isEmpty = require('dataserverinterface/utils/isempty');

var moment = require('moment');

module.exports = React.createClass({
	displayName: 'DateTime',

	propTypes: {
		date: React.PropTypes.any.isRequired,//Date
		relativeTo: React.PropTypes.any,//Date
		format: React.PropTypes.string,
		relative: React.PropTypes.bool,
		prefix: React.PropTypes.string,
		suffix: React.PropTypes.string,
		showToday: React.PropTypes.bool,
		todayText: React.PropTypes.string
	},


	getDefaultProps: function() {
		return {
			date: new Date(),
			relativeTo: undefined,
			format: 'LL',
			relative: false,
			prefix: undefined,
			suffix: undefined,
			showToday: false,
			todayText: 'Today'
		};
	},


	render: function() {
		var props = this.props;
		var _m = moment(props.date),
			m = _m;

		if (props.relativeTo) {
			m = moment.duration(m.diff(props.relativeTo));
			m.fromNow = function(s){
				return this.humanize(!s);
			};
			m.isSame = function() {};//will return falsy
		}

		var text = props.relative ?
					m.fromNow(!isEmpty(props.suffix)) :
					m.format(props.format);

		if (props.showToday && m.isSame(new Date(), 'day')) {
			text = this.props.todayText;
		}

		text = (props.prefix || '') + text + (props.suffix || '');

		props = Object.assign({}, props, {
			dateTime: moment(props.date).format()
		});

		return React.DOM.time(props, text);
	}
});
