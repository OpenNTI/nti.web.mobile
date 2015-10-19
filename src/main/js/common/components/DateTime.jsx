import React from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import isEmpty from 'fbjs/lib/isEmpty';
import moment from 'moment';

export default React.createClass({
	displayName: 'DateTime',

	propTypes: {
		date: React.PropTypes.any,//Date
		relativeTo: React.PropTypes.any,//Date
		format: React.PropTypes.string,
		relative: React.PropTypes.bool,
		prefix: React.PropTypes.string,
		suffix: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.bool
		]),
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
		const {props: {
			date,
			format,
			prefix,
			suffix,
			showToday,
			relativeTo,
			relative,
			todayText
		}} = this;

		if (date == null) {
			return null;
		}

		let m = moment(date);

		if (relativeTo) {
			m = moment.duration(m.diff(relativeTo));
			//#humanize(Boolean) : true to include the suffix,
			//#fromNow(Boolean) : true to omit suffix.
			// :/ instant confusion.
			//
			// We are mapping the duration object to behave just like a moment object.
			m.fromNow = omitSuffix => m.humanize(!omitSuffix);
			m.isSame = emptyFunction;//will return falsy
		}


		let text = relative || relativeTo ?
					m.fromNow(isEmpty(suffix)) :
					m.format(format);

		if (showToday && m.isSame(new Date(), 'day')) {
			text = todayText;
		}

		text = (prefix || '') + text + (suffix || '');

		const props = Object.assign({}, this.props, {
			dateTime: moment(date).format()
		});

		return (<time {...props}>{text}</time>);
	}
});
