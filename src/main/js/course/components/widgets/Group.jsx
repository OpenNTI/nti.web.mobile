'use strict';

var React = require('react/addons');

var IllegalStateException = require('common/exceptions').IllegalStateException;

var ErrorWidget = require('common/components/Error');
var WidgetsMixin = require('./Mixin');

module.exports = React.createClass({
	displayName: 'CourseOverviewGroup',
	mixins: [WidgetsMixin],

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.nticourseoverviewgroup/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	render: function() {
		var item = this.props.item;
		var style = {
			backgroundColor: '#' + item.accentColor
		};
		try {
			return (
				<fieldset className="course-overview-group">
					<legend style={style}>{item.title}</legend>
					{this._renderItems(item.Items)}
				</fieldset>
			);

		} catch (e) {

			if (!(e instanceof IllegalStateException)) {
				return (<ErrorWidget error={e}/>);
			}
		}

		return null;
	}
});
