import React from 'react';
import emptyFunction from 'react/lib/emptyFunction';
import isEmpty from 'nti.lib.interfaces/utils/isempty';
import moment from 'moment';

export default React.createClass({
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


	getDefaultProps () {
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


	render () {
		let {
			date,
			format,
			prefix,
			suffix,
			showToday,
			relativeTo,
			relative,
			todayText } = this.props;

		let m = moment(date);

		if (relativeTo) {
			m = moment.duration(m.diff(relativeTo));
			m.fromNow = (s)=>this.humanize(!s);
			m.isSame = emptyFunction;//will return falsy
		}

		let text = relative ?
					m.fromNow(!isEmpty(suffix)) :
					m.format(format);

		if (showToday && m.isSame(new Date(), 'day')) {
			text = todayText;
		}

		text = (prefix || '') + text + (suffix || '');

		let props = Object.assign({}, this.props, {
			dateTime: moment(date).format()
		});

		return (<time {...props}>{text}</time>);
	}
});
